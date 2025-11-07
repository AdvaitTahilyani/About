import { createClient } from 'redis'

export interface ChessGameState {
  fen: string
  captured: {
    white: string[]
    black: string[]
  }
  lastUpdated: number
}

const CHESS_KEY = 'chess:game:current'

// Create a singleton Redis client
let redis: ReturnType<typeof createClient> | null = null

async function getRedisClient() {
  if (!redis) {
    redis = createClient({
      url: process.env.REDIS_URL
    })
    await redis.connect()
  }
  return redis
}

export async function getChessState(): Promise<ChessGameState | null> {
  try {
    const client = await getRedisClient()
    const data = await client.get(CHESS_KEY)
    if (!data) return null
    return JSON.parse(data)
  } catch (error) {
    console.error('Error fetching chess state:', error)
    return null
  }
}

export async function setChessState(state: ChessGameState): Promise<boolean> {
  try {
    const client = await getRedisClient()
    await client.set(CHESS_KEY, JSON.stringify({
      ...state,
      lastUpdated: Date.now()
    }))
    return true
  } catch (error) {
    console.error('Error saving chess state:', error)
    return false
  }
}

export async function resetChessState(): Promise<boolean> {
  try {
    const client = await getRedisClient()
    await client.del(CHESS_KEY)
    return true
  } catch (error) {
    console.error('Error resetting chess state:', error)
    return false
  }
}
