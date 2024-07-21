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
    const body = await readBody(event)
    const { playerName = 'Anonymous', score, gameTime } = body

    // Add new score to the leaderboard
    const newEntry = await prisma.leaderboard.create({
      data: {
        playerName: String(playerName),
        score: Number(score),
        gameTime: Number(gameTime) || 0, // Provide a default value of 0 if gameTime is undefined
      },
    })

    // Fetch the updated leaderboard
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

    return { newEntry, updatedLeaderboard }
  } else {
    // Handle other HTTP methods if needed
    return { message: 'Method not allowed' }
  }
})
