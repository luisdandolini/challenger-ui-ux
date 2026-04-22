import { doc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import type { Player, PlayerAnswer, RoomQuestion } from '../types'

const XP_TABLE = { facil: 10, medio: 20, dificil: 35 } as const
const SPEED_BONUS = 8
const STREAK_THRESHOLD = 3
const STREAK_MULTIPLIER = 1.5

export const playerService = {
  calculateXp(nivel: RoomQuestion['nivel'], timeMs: number, streak: number): number {
    let xp: number = XP_TABLE[nivel]
    if (timeMs <= 5000) xp += SPEED_BONUS
    if (streak >= STREAK_THRESHOLD) xp = Math.round(xp * STREAK_MULTIPLIER)
    return xp
  },

  async join(roomId: string, name: string): Promise<Player> {
    const playerId = `${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`
    const playerData: Omit<Player, 'id'> = { name, xp: 0, joinedAt: Date.now() }
    await setDoc(doc(db, 'rooms', roomId, 'players', playerId), playerData)
    return { id: playerId, ...playerData }
  },

  async submitAnswer(params: {
    roomId: string
    player: Player
    question: RoomQuestion
    optionIndex: number
    streak: number
    timeMs: number
  }): Promise<{ xpGained: number; newStreak: number }> {
    const { roomId, player, question, optionIndex, streak, timeMs } = params
    const correct = optionIndex === question.resposta
    const newStreak = correct ? streak + 1 : 0
    const xpGained = correct ? playerService.calculateXp(question.nivel, timeMs, newStreak) : 0

    const answerData: PlayerAnswer = {
      playerId: player.id,
      playerName: player.name,
      questionIndex: question.order,
      answer: optionIndex,
      correct,
      xpGained,
      timeMs,
    }

    await setDoc(
      doc(db, 'rooms', roomId, 'answers', `${player.id}_q${question.order}`),
      answerData
    )

    if (xpGained > 0) {
      await updateDoc(doc(db, 'rooms', roomId, 'players', player.id), {
        xp: (player.xp ?? 0) + xpGained,
      })
    }

    return { xpGained, newStreak }
  },
}
