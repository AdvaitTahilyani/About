import { NextRequest, NextResponse } from 'next/server'
import { getChessState, setChessState, resetChessState } from '@/lib/kv'
import { Chess } from 'chess.js'

export async function GET() {
  try {
    const state = await getChessState()

    if (!state) {
      // Return initial chess position
      const game = new Chess()
      return NextResponse.json({
        fen: game.fen(),
        captured: { white: [], black: [] },
        lastUpdated: Date.now()
      })
    }

    return NextResponse.json(state)
  } catch (error) {
    console.error('GET /api/chess error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chess state' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fen, captured, reset } = body

    if (reset) {
      await resetChessState()
      const game = new Chess()
      return NextResponse.json({
        fen: game.fen(),
        captured: { white: [], black: [] },
        lastUpdated: Date.now()
      })
    }

    if (!fen || !captured) {
      return NextResponse.json(
        { error: 'Missing required fields: fen, captured' },
        { status: 400 }
      )
    }

    // Validate FEN
    try {
      const game = new Chess()
      game.load(fen)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid FEN string' },
        { status: 400 }
      )
    }

    const success = await setChessState({ fen, captured, lastUpdated: Date.now() })

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save chess state' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, fen, captured })
  } catch (error) {
    console.error('POST /api/chess error:', error)
    return NextResponse.json(
      { error: 'Failed to update chess state' },
      { status: 500 }
    )
  }
}
