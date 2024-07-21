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
        player_name: true,
        score: true,
        game_time: true,
      },
    })
    return leaderboard
  } else if (event.req.method === 'POST') {
    // Save a new score
    const { player_name, score, game_time } = await readBody(event)
    const newScore = await prisma.leaderboard.create({
      data: {
        player_name,
        score: parseInt(score),
        game_time: parseInt(game_time),
      },
    })
    return newScore
  } else {
    // Handle other HTTP methods if needed
    return { message: 'Method not allowed' }
  }
})
