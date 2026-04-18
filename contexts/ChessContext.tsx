'use client'

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { Chess, Move } from 'chess.js'
import { loadBot, pickBotMove } from '@/lib/chessBot'

interface ChessContextType {
  game: Chess | null
  fen: string
  isAdminTurn: boolean
  gameOver: boolean
  winner: string | null
  capturedPieces: { white: string[]; black: string[] }
  makeMove: (from: string, to: string) => boolean
  resetGame: () => void
  loading: boolean
  botError: string | null
}

const ChessContext = createContext<ChessContextType | undefined>(undefined)

const BOT_COLOR = 'b' as const
const USER_COLOR = 'w' as const

// Adds a `captured` piece onto the right capture pile for the moving side.
function applyCapture(
  captured: { white: string[]; black: string[] },
  move: Move,
): { white: string[]; black: string[] } {
  if (!move.captured) return captured
  if (move.color === 'w') {
    return { ...captured, black: [...captured.black, move.captured] }
  }
  return { ...captured, white: [...captured.white, move.captured] }
}

export function ChessProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<Chess | null>(null)
  const [fen, setFen] = useState<string>('')
  const [capturedPieces, setCapturedPieces] = useState<{ white: string[]; black: string[] }>({
    white: [],
    black: [],
  })
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [botThinking, setBotThinking] = useState(false)
  const [botError, setBotError] = useState<string | null>(null)

  // Guards so we never queue two bot moves for the same position.
  const botBusyRef = useRef(false)
  const gameRef = useRef<Chess | null>(null)

  useEffect(() => {
    gameRef.current = game
  }, [game])

  useEffect(() => {
    setMounted(true)
    const newGame = new Chess()
    setGame(newGame)
    setFen(newGame.fen())
    setLoading(false)
    // Warm up the ONNX session in the background so the first bot move
    // doesn't have to wait for a 45MB model download + WASM compile.
    loadBot().catch((err) => {
      console.error('Failed to warm up chess bot:', err)
      setBotError('Bot model failed to load. Refresh to try again.')
    })
  }, [])

  const makeMove = useCallback(
    (from: string, to: string): boolean => {
      const current = gameRef.current
      if (!current) return false
      if (current.turn() !== USER_COLOR) return false
      if (botBusyRef.current) return false

      try {
        const move = current.move({ from, to, promotion: 'q' })
        if (!move) return false

        setCapturedPieces((prev) => applyCapture(prev, move))
        setFen(current.fen())
        return true
      } catch {
        return false
      }
    },
    [],
  )

  // Whenever it becomes the bot's turn, run inference and push its move.
  useEffect(() => {
    if (!game) return
    if (game.isGameOver()) return
    if (game.turn() !== BOT_COLOR) return
    if (botBusyRef.current) return

    let cancelled = false
    botBusyRef.current = true
    setBotThinking(true)
    setBotError(null)

    const fenAtRequest = game.fen()

    pickBotMove(fenAtRequest)
      .then((result) => {
        if (cancelled) return
        const live = gameRef.current
        // Bail if the board changed under us (reset, etc).
        if (!live || live.fen() !== fenAtRequest) return
        if (!result) return

        const move = live.move({
          from: result.move.from,
          to: result.move.to,
          promotion: result.move.promotion ?? undefined,
        })
        if (!move) {
          setBotError('Bot tried to play an illegal move.')
          return
        }
        setCapturedPieces((prev) => applyCapture(prev, move))
        setFen(live.fen())
      })
      .catch((err) => {
        console.error('Bot move failed:', err)
        if (!cancelled) setBotError('Bot inference failed. Try again.')
      })
      .finally(() => {
        if (!cancelled) setBotThinking(false)
        botBusyRef.current = false
      })

    return () => {
      cancelled = true
    }
  }, [fen, game])

  const resetGame = useCallback(() => {
    botBusyRef.current = false
    setBotThinking(false)
    setBotError(null)
    const newGame = new Chess()
    setGame(newGame)
    setFen(newGame.fen())
    setCapturedPieces({ white: [], black: [] })
  }, [])

  const isAdminTurn = Boolean(game && (game.turn() === BOT_COLOR || botThinking))
  const gameOver = game ? game.isGameOver() : false
  const winner = game && gameOver
    ? game.isCheckmate()
      ? game.turn() === 'w'
        ? 'Admin (Black)'
        : 'Visitors (White)'
      : 'Draw'
    : null

  useEffect(() => {
    if (gameOver && game?.isCheckmate()) {
      const timer = setTimeout(() => {
        resetGame()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [gameOver, game, resetGame])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ChessContext.Provider
      value={{
        game,
        fen,
        isAdminTurn,
        gameOver,
        winner,
        capturedPieces,
        makeMove,
        resetGame,
        loading,
        botError,
      }}
    >
      {children}
    </ChessContext.Provider>
  )
}

export function useChess() {
  const context = useContext(ChessContext)
  if (context === undefined) {
    return {
      game: null,
      fen: '',
      isAdminTurn: false,
      gameOver: false,
      winner: null,
      capturedPieces: { white: [], black: [] },
      makeMove: () => false,
      resetGame: () => {},
      loading: true,
      botError: null,
    }
  }
  return context
}
