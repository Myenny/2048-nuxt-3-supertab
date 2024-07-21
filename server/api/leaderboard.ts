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
    const { playerName, score, gameTime } = await readBody(event)
    const newScore = await prisma.leaderboard.create({
      data: {
        playerName,
        score: parseInt(score),
        gameTime: parseInt(gameTime),
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
