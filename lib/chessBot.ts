import * as ort from 'onnxruntime-web';
import { Chess, Square, Move } from 'chess.js';

// Configuration for WASM files
ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.16.3/dist/';

export class ChessBot {
  private session: ort.InferenceSession | null = null;
  private loading: boolean = false;
  private initialized: boolean = false;

  constructor() {
    this.init();
  }

  async init() {
    if (this.initialized || this.loading) return;
    this.loading = true;

    try {
      this.session = await ort.InferenceSession.create('/chess_model.onnx', {
        executionProviders: ['wasm'],
      });
      this.initialized = true;
      console.log('Chess model loaded successfully');
    } catch (error) {
      console.error('Failed to load chess model:', error);
    } finally {
      this.loading = false;
    }
  }

  async getBestMove(fen: string): Promise<string | null> {
    if (!this.session) {
      await this.init();
      if (!this.session) return null;
    }

    try {
      const game = new Chess(fen);
      const tensor = this.fenToTensor(game);
      
      const feeds: Record<string, ort.Tensor> = {};
      feeds[this.session.inputNames[0]] = tensor;

      const outputMap = await this.session.run(feeds);
      const outputTensor = outputMap[this.session.outputNames[0]];
      const data = outputTensor.data as Float32Array;

      // Find legal moves and sort by probability
      const legalMoves = game.moves({ verbose: true });
      const moveProbs: { move: Move; prob: number }[] = [];

      for (const move of legalMoves) {
        const moveIdx = this.encodeMove(move);
        if (moveIdx >= 0 && moveIdx < data.length) {
          moveProbs.push({ move, prob: data[moveIdx] });
        }
      }

      // Sort by probability descending
      moveProbs.sort((a, b) => b.prob - a.prob);

      if (moveProbs.length > 0) {
        // Add some randomness to top moves to avoid repetition if needed
        // For now, just pick the best one
        const bestMove = moveProbs[0].move;
        return bestMove.from + bestMove.to + (bestMove.promotion ? bestMove.promotion : '');
      }

      return null;
    } catch (error) {
      console.error('Error getting best move:', error);
      return null;
    }
  }

  // Convert FEN to 14x8x8 tensor
  private fenToTensor(game: Chess): ort.Tensor {
    const board = game.board();
    const data = new Float32Array(14 * 8 * 8).fill(0);
    
    // Helper to set value
    const set = (plane: number, rank: number, file: number) => {
      data[plane * 64 + rank * 8 + file] = 1.0;
    };

    // Piece placement
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const square = board[7 - rank][file]; // chess.js board is row-major from rank 8
        if (square) {
            let pieceType = 0;
            switch(square.type) {
                case 'p': pieceType = 0; break;
                case 'n': pieceType = 1; break;
                case 'b': pieceType = 2; break;
                case 'r': pieceType = 3; break;
                case 'q': pieceType = 4; break;
                case 'k': pieceType = 5; break;
            }
            
            // Offset by 6 for black pieces
            const plane = square.color === 'b' ? pieceType + 6 : pieceType;
            
            // Map rank/file to tensor coordinates
            // In python: rank 0-7, file 0-7
            // Here rank 0 is 1st rank, so we map correctly
            set(plane, rank, file);
        }
      }
    }

    // Turn indicator
    // Plane 12: All 1s if White to move
    // Plane 13: All 1s if Black to move
    const turnPlane = game.turn() === 'w' ? 12 : 13;
    for (let i = 0; i < 64; i++) {
        data[turnPlane * 64 + i] = 1.0;
    }

    // Create tensor with shape [1, 14, 8, 8]
    return new ort.Tensor('float32', data, [1, 14, 8, 8]);
  }

  private encodeMove(move: Move): number {
    const fromSquare = this.squareToIndex(move.from);
    const toSquare = this.squareToIndex(move.to);
    return fromSquare * 64 + toSquare;
  }

  private squareToIndex(square: string): number {
    const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
    const rank = parseInt(square[1]) - 1;
    return rank * 8 + file;
  }
}

export const chessBot = new ChessBot();

