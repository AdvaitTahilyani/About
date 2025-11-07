'use client'

import { useState, useEffect } from 'react'
import { Chessboard } from 'react-chessboard'
import { useChess } from '@/contexts/ChessContext'
import { useAdmin } from '@/contexts/AdminContext'
import { motion } from 'framer-motion'
import { RotateCcw, Trophy, Users, Crown } from 'lucide-react'
import type { Square } from 'chess.js'

const ChessGame = () => {
  const { fen, isAdminTurn, gameOver, winner, capturedPieces, makeMove, resetGame, loading } = useChess()
  const { isAdmin } = useAdmin()
  const [mounted, setMounted] = useState(false)
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
  const [moveFrom, setMoveFrom] = useState<Square | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    // Check if it's the correct player's turn
    if (isAdminTurn && !isAdmin) {
      return false // Not admin's turn
    }
    if (!isAdminTurn && isAdmin) {
      return false // Not visitor's turn
    }

    const success = makeMove(sourceSquare, targetSquare)
    if (success) {
      setMoveFrom(null)
      setSelectedSquare(null)
    }
    return success
  }

  const onSquareClick = (square: Square) => {
    // Check if it's the correct player's turn
    if (isAdminTurn && !isAdmin) {
      return // Not admin's turn
    }
    if (!isAdminTurn && isAdmin) {
      return // Not visitor's turn
    }

    // If no piece is selected, select this square
    if (!moveFrom) {
      setMoveFrom(square)
      setSelectedSquare(square)
      return
    }

    // If clicking the same square, deselect
    if (moveFrom === square) {
      setMoveFrom(null)
      setSelectedSquare(null)
      return
    }

    // Try to make the move
    const success = makeMove(moveFrom, square)
    if (success) {
      setMoveFrom(null)
      setSelectedSquare(null)
    } else {
      // If move failed, select the new square instead
      setMoveFrom(square)
      setSelectedSquare(square)
    }
  }

  const getPieceSymbol = (piece: string) => {
    const symbols: Record<string, string> = {
      p: '♟',
      n: '♞',
      b: '♝',
      r: '♜',
      q: '♛',
      k: '♚'
    }
    return symbols[piece] || piece
  }

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center opacity-60">Loading chess board...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-effect p-8 rounded-lg"
      >
        {/* Game Status */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold mb-2">Chess Challenge</h2>
          <p className="text-sm opacity-70 mb-4 max-w-2xl mx-auto">
            Play against me in a game of chess where it's every viewer against me
          </p>
          <div className="flex items-center justify-center gap-4 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>Visitors (White)</span>
            </div>
            <span>vs</span>
            <div className="flex items-center gap-2">
              <Crown size={16} />
              <span>Admin (Black)</span>
            </div>
          </div>
        </div>

        {/* Turn Indicator */}
        {!gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/20 rounded-md">
              {isAdminTurn ? (
                <>
                  <Crown size={16} className="text-yellow-400" />
                  <span className="font-medium">Admin's Turn (Black)</span>
                </>
              ) : (
                <>
                  <Users size={16} className="text-blue-400" />
                  <span className="font-medium">Visitors' Turn (White)</span>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Game Over Message */}
        {gameOver && winner && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center"
          >
            <div className="flex items-center justify-center gap-2 text-green-400 font-bold text-lg">
              <Trophy size={20} />
              <span>{winner} Wins!</span>
            </div>
            <p className="text-sm opacity-80 mt-2">Game will reset in 5 seconds...</p>
          </motion.div>
        )}

        {/* Chess Board */}
        <div className="mb-6">
          <div className="rounded-lg overflow-hidden border-2 border-white/20" style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <Chessboard
              position={fen}
              onPieceDrop={onDrop}
              onSquareClick={onSquareClick}
              boardOrientation={isAdmin ? 'black' : 'white'}
              customDarkSquareStyle={{ backgroundColor: '#1a1a1a' }}
              customLightSquareStyle={{ backgroundColor: '#2a2a2a' }}
              customSquareStyles={{
                ...(selectedSquare && {
                  [selectedSquare]: {
                    backgroundColor: 'rgba(255, 255, 0, 0.4)'
                  }
                })
              }}
              customBoardStyle={{
                borderRadius: '0px',
              }}
              arePiecesDraggable={true}
              areArrowsAllowed={false}
              customDropSquareStyle={{
                boxShadow: 'inset 0 0 1px 6px rgba(255,255,255,0.75)'
              }}
              boardWidth={600}
            />
          </div>
        </div>

        {/* Captured Pieces */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="glass-effect p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="opacity-60" />
              <h3 className="font-bold text-sm opacity-80">White Captured</h3>
            </div>
            <div className="flex flex-wrap gap-1">
              {capturedPieces.white.length > 0 ? (
                capturedPieces.white.map((piece, index) => (
                  <span key={index} className="text-xl opacity-60">
                    {getPieceSymbol(piece)}
                  </span>
                ))
              ) : (
                <span className="text-xs opacity-40">None</span>
              )}
            </div>
          </div>

          <div className="glass-effect p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Crown size={16} className="opacity-60" />
              <h3 className="font-bold text-sm opacity-80">Black Captured</h3>
            </div>
            <div className="flex flex-wrap gap-1">
              {capturedPieces.black.length > 0 ? (
                capturedPieces.black.map((piece, index) => (
                  <span key={index} className="text-xl opacity-60">
                    {getPieceSymbol(piece)}
                  </span>
                ))
              ) : (
                <span className="text-xs opacity-40">None</span>
              )}
            </div>
          </div>
        </div>

        {/* Reset Button (Admin Only) */}
        {isAdmin && (
          <div className="text-center">
            <motion.button
              onClick={resetGame}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/20 rounded-md hover:bg-white/10 transition-colors"
            >
              <RotateCcw size={16} />
              <span>Reset Game</span>
            </motion.button>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 text-center text-sm opacity-60">
          <p>Click to select a piece, then click where to move it. Or drag and drop pieces.</p>
          {!isAdmin && (
            <p className="mt-1">You are playing as White</p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default ChessGame
