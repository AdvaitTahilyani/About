'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { Chess } from 'chess.js'
import Cookies from 'js-cookie'
import { chessBot } from '@/lib/chessBot'

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

const COOKIE_KEY = 'chess_game_state'

export function ChessProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<Chess | null>(null)
  const [fen, setFen] = useState<string>('')
  const [capturedPieces, setCapturedPieces] = useState<{ white: string[]; black: string[] }>({
    white: [],
    black: []
  })
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch game state from Cookie
  const fetchGameState = useCallback(() => {
    try {
      const savedState = Cookies.get(COOKIE_KEY)
      
      const newGame = new Chess()
      let savedCaptured = { white: [], black: [] }

      if (savedState) {
        const data = JSON.parse(savedState)
        if (data.fen) {
          try {
            newGame.load(data.fen)
          } catch (e) {
            console.error('Invalid FEN in cookie, resetting', e)
          }
        }
        if (data.captured) {
          savedCaptured = data.captured
        }
      }

      setGame(newGame)
      setFen(newGame.fen())
      setCapturedPieces(savedCaptured)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load chess state from cookie:', error)
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

  // Save game state to Cookie
  const saveGameState = useCallback((gameInstance: Chess, captured: { white: string[]; black: string[] }) => {
    try {
      Cookies.set(COOKIE_KEY, JSON.stringify({
        fen: gameInstance.fen(),
        captured
      }), { expires: 30 }) // Expire in 30 days
    } catch (error) {
      console.error('Failed to save chess state to cookie:', error)
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

  // Bot move logic
  useEffect(() => {
    const makeBotMove = async () => {
        if (game && game.turn() === 'b' && !game.isGameOver()) {
            // Short delay for realism
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const bestMove = await chessBot.getBestMove(game.fen());
            if (bestMove) {
                // Parse "e2e4" format
                const from = bestMove.substring(0, 2);
                const to = bestMove.substring(2, 4);
                // Handle promotion if present (e.g., "a7a8q")
                const promotion = bestMove.length > 4 ? bestMove[4] : undefined;
                
                try {
                    const move = game.move({ from, to, promotion: promotion || 'q' });
                    if (move) {
                        if (move.captured) {
                            const newCaptured = { ...capturedPieces }
                            newCaptured.white.push(move.captured)
                            setCapturedPieces(newCaptured)
                            saveGameState(game, newCaptured)
                        } else {
                            saveGameState(game, capturedPieces)
                        }
                        setFen(game.fen())
                    }
                } catch (e) {
                    console.error("Bot tried invalid move:", bestMove);
                }
            }
        }
    }
    
    makeBotMove();
  }, [game, fen, capturedPieces, saveGameState]);

  const resetGame = useCallback(() => {
    if (!game) return

    try {
      Cookies.remove(COOKIE_KEY)

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
