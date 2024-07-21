import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (event.req.method === 'GET') {
    // Fetch the top 10 scores
    const leaderboard = await prisma.leaderboard.findMany({
      take: 10,
      orderBy: {
        score: 'desc',
      },
      select: {
        playerName: true,
        score: true,
        gameTime: true,
      },
    })
    return leaderboard
  } else if (event.req.method === 'POST') {
    // Save a new score
    const body = await readBody(event)
    const newScore = await prisma.leaderboard.create({
      data: {
        playerName: String(body.playerName || ''),
        score: parseInt(String(body.score || '0'), 10),
        gameTime: parseInt(String(body.gameTime || '0'), 10),
      },
    })
    
    // Fetch updated leaderboard
    const updatedLeaderboard = await prisma.leaderboard.findMany({
      take: 10,
      orderBy: {
        score: 'desc',
      },
      select: {
        playerName: true,
        score: true,
        gameTime: true,
      },
    })
    
    return { newScore, updatedLeaderboard }
  } else {
    // Handle other HTTP methods if needed
    return { message: 'Method not allowed' }
  }
})
