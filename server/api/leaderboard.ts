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
    })
    return leaderboard
  } else if (event.req.method === 'POST') {
    // Save a new score
    const { player_name, score } = await readBody(event)
    const newScore = await prisma.leaderboard.create({
      data: {
        player_name,
        score,
      },
    })
    return newScore
  } else {
    // Handle other HTTP methods if needed
    return { message: 'Method not allowed' }
  }
})
