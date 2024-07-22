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
    let { playerName, score, gameTime } = body

    // Validate playerName
    if (!playerName || playerName.trim() === '') {
      return {
        statusCode: 400,
        body: {
          message: 'playerName is required and cannot be empty',
        },
      }
    }

    // Ensure score and gameTime are numbers
    score = Number(score)
    gameTime = Number(gameTime) || 0

    if (isNaN(score) || isNaN(gameTime)) {
      return {
        statusCode: 400,
        body: {
          message: 'Score and gameTime must be valid numbers',
        },
      }
    }

    // Add new score to the leaderboard
    // Check if an entry with the same playerName, score, and gameTime already exists
    const existingEntry = await prisma.leaderboard.findFirst({
      where: {
        playerName: String(playerName),
        score: score,
        gameTime: gameTime,
      },
    })

    if (!existingEntry) {
      const newEntry = await prisma.leaderboard.create({
        data: {
          playerName: String(playerName),
          score: score,
          gameTime: gameTime,
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
