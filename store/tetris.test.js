import { setActivePinia, createPinia } from 'pinia'
import { useTetrisStore } from './tetris'

describe('Tetris Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with correct default state', () => {
    const store = useTetrisStore()
    expect(store.board).toHaveLength(20)
    expect(store.board[0]).toHaveLength(10)
    expect(store.score).toBe(0)
    expect(store.level).toBe(1)
    expect(store.gameOver).toBe(false)
  })

  it('moves piece left', () => {
    const store = useTetrisStore()
    store.spawnNewPiece()
    const initialX = store.currentPosition.x
    store.moveLeft()
    expect(store.currentPosition.x).toBe(initialX - 1)
  })

  it('moves piece right', () => {
    const store = useTetrisStore()
    store.spawnNewPiece()
    const initialX = store.currentPosition.x
    store.moveRight()
    expect(store.currentPosition.x).toBe(initialX + 1)
  })

  it('rotates piece', () => {
    const store = useTetrisStore()
    store.spawnNewPiece()
    const initialPiece = JSON.stringify(store.currentPiece)
    store.rotate()
    expect(JSON.stringify(store.currentPiece)).not.toBe(initialPiece)
  })

  // Add more tests for other actions and edge cases
})
