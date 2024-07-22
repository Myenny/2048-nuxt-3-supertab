import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (event.req.method === 'GET') {
    // Fetch the top 20 scores
    const leaderboard = await prisma.leaderboard.findMany({
      take: 20,
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
    // Check if an entry with the same score and game time already exists
    const existingEntry = await prisma.leaderboard.findFirst({
      where: {
        playerName: String(playerName),
        score: Number(score),
        gameTime: Number(gameTime) || 0,
      },
    })

    if (!existingEntry) {
      const newEntry = await prisma.leaderboard.create({
        data: {
          playerName: String(playerName),
          score: Number(score),
          gameTime: Number(gameTime) || 0,
        },
      })

      // Return only the new entry
      return newEntry
    } else {
      // Return the existing entry if it's a duplicate
      return existingEntry
    }
  } else {
    // Handle other HTTP methods if needed
    return { message: 'Method not allowed' }
  }
})
