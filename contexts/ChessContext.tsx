'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { Chess } from 'chess.js'

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
}

const ChessContext = createContext<ChessContextType | undefined>(undefined)

export function ChessProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<Chess | null>(null)
  const [fen, setFen] = useState<string>('')
  const [capturedPieces, setCapturedPieces] = useState<{ white: string[]; black: string[] }>({
    white: [],
    black: []
  })
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch game state from API
  const fetchGameState = useCallback(async () => {
    try {
      const response = await fetch('/api/chess')
      const data = await response.json()

      const newGame = new Chess()
      if (data.fen) {
        newGame.load(data.fen)
      }

      setGame(newGame)
      setFen(newGame.fen())
      setCapturedPieces(data.captured || { white: [], black: [] })
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch chess state:', error)
      // Fallback to new game
      const newGame = new Chess()
      setGame(newGame)
      setFen(newGame.fen())
      setLoading(false)
    }
  }, [])

  // Initialize game
  useEffect(() => {
    setMounted(true)
    fetchGameState()
  }, [fetchGameState])

  // Save game state to API
  const saveGameState = useCallback(async (gameInstance: Chess, captured: { white: string[]; black: string[] }) => {
    try {
      await fetch('/api/chess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fen: gameInstance.fen(),
          captured
        })
      })
    } catch (error) {
      console.error('Failed to save chess state:', error)
    }
  }, [])

  const makeMove = useCallback((from: string, to: string): boolean => {
    if (!game) return false

    try {
      const move = game.move({ from, to, promotion: 'q' })

      if (move) {
        // Track captured pieces
        if (move.captured) {
          const newCaptured = { ...capturedPieces }
          if (move.color === 'w') {
            newCaptured.black.push(move.captured)
          } else {
            newCaptured.white.push(move.captured)
          }
          setCapturedPieces(newCaptured)
          saveGameState(game, newCaptured)
        } else {
          saveGameState(game, capturedPieces)
        }

        setFen(game.fen())
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }, [game, capturedPieces, saveGameState])

  const resetGame = useCallback(async () => {
    if (!game) return

    try {
      const response = await fetch('/api/chess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset: true })
      })
      const data = await response.json()

      game.reset()
      setFen(game.fen())
      const newCaptured = { white: [], black: [] }
      setCapturedPieces(newCaptured)
    } catch (error) {
      console.error('Failed to reset chess game:', error)
    }
  }, [game])

  const isAdminTurn = game ? game.turn() === 'b' : false
  const gameOver = game ? game.isGameOver() : false
  const winner = game && gameOver
    ? game.isCheckmate()
      ? game.turn() === 'w' ? 'Admin (Black)' : 'Visitors (White)'
      : 'Draw'
    : null

  // Auto reset on checkmate after 5 seconds
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
        loading
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
      resetGame: async () => {},
      loading: true
    }
  }
  return context
}
