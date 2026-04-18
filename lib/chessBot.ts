import * as ort from 'onnxruntime-web'
import { Chess, Move } from 'chess.js'

// Keep onnxruntime-web from trying to download WASM files from a CDN.
// The runtime files are served out of /public/ (ort-wasm*.wasm).
if (typeof window !== 'undefined') {
    ort.env.wasm.wasmPaths = '/'
    // Single-threaded is fine for a 45MB policy net on a chess page.
    ort.env.wasm.numThreads = 1
}

const MODEL_URL = '/chess_model.onnx'

// Piece-type → plane offset. Matches process.py:
//   planes 0-5  white P N B R Q K
//   planes 6-11 black P N B R Q K
//   plane 12    1 if white-to-move
//   plane 13    1 if black-to-move
const PIECE_TO_PLANE: Record<string, number> = {
    p: 0,
    n: 1,
    b: 2,
    r: 3,
    q: 4,
    k: 5,
}

let sessionPromise: Promise<ort.InferenceSession> | null = null

export function loadBot(): Promise<ort.InferenceSession> {
    if (!sessionPromise) {
        sessionPromise = ort.InferenceSession.create(MODEL_URL, {
            executionProviders: ['wasm'],
            graphOptimizationLevel: 'all',
        }).catch((err) => {
            // Reset on failure so a later call can retry.
            sessionPromise = null
            throw err
        })
    }
    return sessionPromise
}

// 'e4' → python-chess square index (a1 = 0, h1 = 7, a8 = 56, h8 = 63).
function squareToIndex(sq: string): number {
    const file = sq.charCodeAt(0) - 97
    const rank = parseInt(sq[1], 10) - 1
    return rank * 8 + file
}

function boardToTensor(chess: Chess): Float32Array {
    const tensor = new Float32Array(14 * 8 * 8)
    const board = chess.board()

    // chess.board()[0] is rank 8, board()[7] is rank 1; each row is files a-h.
    // python-chess indexes rank 0 = 1, rank 7 = 8, so flip the row index.
    for (let row = 0; row < 8; row++) {
        for (let file = 0; file < 8; file++) {
            const piece = board[row][file]
            if (!piece) continue
            const rank = 7 - row
            let plane = PIECE_TO_PLANE[piece.type]
            if (piece.color === 'b') plane += 6
            tensor[plane * 64 + rank * 8 + file] = 1.0
        }
    }

    const turnPlane = chess.turn() === 'w' ? 12 : 13
    const base = turnPlane * 64
    for (let i = 0; i < 64; i++) tensor[base + i] = 1.0

    return tensor
}

// Partial argsort: returns the top-k indices of arr in descending order of value.
// Uses a running min-heap keyed by (value, index). Much cheaper than sorting
// the full 4096-element array when we only need a handful of candidates.
function topKIndices(arr: Float32Array, k: number): number[] {
    const heap: Array<[number, number]> = []
    const siftUp = (i: number) => {
        while (i > 0) {
            const p = (i - 1) >> 1
            if (heap[p][0] > heap[i][0]) {
                ;[heap[p], heap[i]] = [heap[i], heap[p]]
                i = p
            } else break
        }
    }
    const siftDown = (i: number) => {
        const n = heap.length
        while (true) {
            const l = i * 2 + 1
            const r = l + 1
            let s = i
            if (l < n && heap[l][0] < heap[s][0]) s = l
            if (r < n && heap[r][0] < heap[s][0]) s = r
            if (s === i) break
            ;[heap[s], heap[i]] = [heap[i], heap[s]]
            i = s
        }
    }

    for (let i = 0; i < arr.length; i++) {
        const v = arr[i]
        if (heap.length < k) {
            heap.push([v, i])
            siftUp(heap.length - 1)
        } else if (v > heap[0][0]) {
            heap[0] = [v, i]
            siftDown(0)
        }
    }
    heap.sort((a, b) => b[0] - a[0])
    return heap.map((e) => e[1])
}

export interface BotMoveResult {
    move: Move
    /** 0..1 confidence relative to the top logit considered. */
    score: number
}

/**
 * Pick a move for the side-to-move in `fen` using the ONNX policy network.
 * Walks the sorted logits until it finds a legal move, matching play.py's
 * "highest-scoring legal move" strategy exactly.
 */
export async function pickBotMove(fen: string): Promise<BotMoveResult | null> {
    const chess = new Chess(fen)
    const legalMoves = chess.moves({ verbose: true }) as Move[]
    if (legalMoves.length === 0) return null

    // Bucket legal moves by (from*64 + to) so we can O(1) the lookup per
    // candidate logit. If multiple moves share a (from, to) pair (underpromo),
    // prefer queen promotion — same heuristic as decode_move in process.py.
    const legalByKey = new Map<number, Move>()
    for (const m of legalMoves) {
        const key = squareToIndex(m.from) * 64 + squareToIndex(m.to)
        const existing = legalByKey.get(key)
        if (!existing || m.promotion === 'q') {
            legalByKey.set(key, m)
        }
    }

    const session = await loadBot()
    const tensor = boardToTensor(chess)
    const input = new ort.Tensor('float32', tensor, [1, 14, 8, 8])
    const inputName = session.inputNames[0] ?? 'input'
    const outputName = session.outputNames[0] ?? 'output'

    const result = await session.run({ [inputName]: input })
    const logits = result[outputName].data as Float32Array

    // Most of the 4096 classes are illegal on any given board, so scanning the
    // top-N candidates is enough. Fall back to a full sort only if needed.
    const scanSizes = [32, 128, 512, 4096]
    let topLogit = Number.NEGATIVE_INFINITY
    for (const size of scanSizes) {
        const indices = topKIndices(logits, Math.min(size, logits.length))
        if (topLogit === Number.NEGATIVE_INFINITY) {
            topLogit = logits[indices[0]]
        }
        for (const idx of indices) {
            const move = legalByKey.get(idx)
            if (move) {
                const range = Math.abs(topLogit) + 1e-6
                const score = Math.max(0, Math.min(1, (logits[idx] - (topLogit - range)) / range))
                return { move, score }
            }
        }
    }

    // Sanity fallback — shouldn't happen because legalMoves is non-empty.
    return { move: legalMoves[0], score: 0 }
}
