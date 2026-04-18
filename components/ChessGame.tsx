'use client'

import { useEffect, useState } from 'react'
import { Chessboard } from 'react-chessboard'
import { useChess } from '@/contexts/ChessContext'
import { motion } from 'framer-motion'
import { RotateCcw, Trophy, Users, Crown } from 'lucide-react'
import type { Square } from 'chess.js'

const ChessGame = () => {
    const { fen, isAdminTurn, gameOver, winner, capturedPieces, makeMove, resetGame, loading, botError } = useChess()
    const [mounted, setMounted] = useState(false)
    const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
    const [moveFrom, setMoveFrom] = useState<Square | null>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    const onDrop = (sourceSquare: string, targetSquare: string) => {
        if (isAdminTurn) {
            return false
        }

        const success = makeMove(sourceSquare, targetSquare)
        if (success) {
            setMoveFrom(null)
            setSelectedSquare(null)
        }
        return success
    }

    const onSquareClick = (square: Square) => {
        if (isAdminTurn) {
            return
        }

        if (!moveFrom) {
            setMoveFrom(square)
            setSelectedSquare(square)
            return
        }

        if (moveFrom === square) {
            setMoveFrom(null)
            setSelectedSquare(null)
            return
        }

        const success = makeMove(moveFrom, square)
        if (success) {
            setMoveFrom(null)
            setSelectedSquare(null)
        } else {
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
        <div className="mx-auto max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-effect rounded-lg p-2 sm:p-6 md:p-8"
            >
                <div className="mb-6 text-center">
                    <h2 className="mb-2 text-3xl font-bold">Chess vs AI</h2>
                    <p className="mx-auto mb-4 max-w-2xl text-sm opacity-70">
                        Test your skills against a neural network I trained on my own game history to mimic my playing style
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 text-sm opacity-80 sm:gap-4">
                        <div className="flex items-center gap-2">
                            <Users size={16} />
                            <span>You (White)</span>
                        </div>
                        <span>vs</span>
                        <div className="flex items-center gap-2">
                            <Crown size={16} />
                            <span>Advait AI (Black)</span>
                        </div>
                    </div>
                </div>

                {!gameOver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-4 text-center"
                    >
                        <div className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-2">
                            {isAdminTurn ? (
                                <>
                                    <Crown size={16} className="text-yellow-400" />
                                    <span className="font-medium">Bot is thinking...</span>
                                </>
                            ) : (
                                <>
                                    <Users size={16} className="text-blue-400" />
                                    <span className="font-medium">Your Turn (White)</span>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}

                {botError && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-center text-sm text-red-300"
                    >
                        {botError}
                    </motion.div>
                )}

                {gameOver && winner && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-center"
                    >
                        <div className="flex items-center justify-center gap-2 text-lg font-bold text-green-400">
                            <Trophy size={20} />
                            <span>{winner === 'Admin (Black)' ? 'Bot Wins!' : 'You Win!'}</span>
                        </div>
                        <p className="mt-2 text-sm opacity-80">Game will reset in 5 seconds...</p>
                    </motion.div>
                )}

                <div className="mb-6">
                    <div
                        className="mx-auto w-full max-w-[600px] overflow-hidden rounded-lg border-2 border-white/20"
                    >
                        <Chessboard
                            position={fen}
                            onPieceDrop={onDrop}
                            onSquareClick={onSquareClick}
                            boardOrientation="white"
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
                        />
                    </div>
                </div>

                <div className="mb-6 grid gap-4 md:grid-cols-2">
                    <div className="glass-effect rounded-lg p-4">
                        <div className="mb-2 flex items-center gap-2">
                            <Users size={16} className="opacity-60" />
                            <h3 className="text-sm font-bold opacity-80">White Captured</h3>
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

                    <div className="glass-effect rounded-lg p-4">
                        <div className="mb-2 flex items-center gap-2">
                            <Crown size={16} className="opacity-60" />
                            <h3 className="text-sm font-bold opacity-80">Black Captured</h3>
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

                <div className="text-center">
                    <motion.button
                        onClick={resetGame}
                        whileHover={{ scale: 1.05, translateY: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-shine glass-effect inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium uppercase tracking-widest opacity-80 shadow-glow transition-all duration-300 hover:bg-white/10 hover:opacity-100 sm:px-8"
                    >
                        <RotateCcw size={16} className="text-blue-400" />
                        <span>Reset Board</span>
                    </motion.button>
                </div>

                <div className="mt-6 text-center text-sm opacity-60">
                    <p>Click to select a piece, then click where to move it. Or drag and drop pieces.</p>
                </div>
            </motion.div>
        </div>
    )
}

export default ChessGame
