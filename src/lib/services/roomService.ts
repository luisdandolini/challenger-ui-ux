import {
  collection, doc, setDoc, updateDoc, onSnapshot,
  query, orderBy, getDocs, where, type Unsubscribe,
} from 'firebase/firestore'
import { db } from '../firebase'
import type { Room, RoomQuestion, Player, PlayerAnswer } from '../types'

const QUESTION_DURATION = 30

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export const roomService = {
  async create(
    adminId: string,
    adminEmail: string,
    questions: Omit<RoomQuestion, 'id'>[]
  ): Promise<{ roomId: string; code: string; roomData: Omit<Room, 'id'> }> {
    const roomId = doc(collection(db, 'rooms')).id
    const code = generateCode()
    const roomData: Omit<Room, 'id'> = {
      code,
      adminId,
      adminName: adminEmail,
      status: 'waiting',
      currentQuestion: 0,
      totalQuestions: questions.length,
      createdAt: Date.now(),
      questionDuration: QUESTION_DURATION,
    }
    await setDoc(doc(db, 'rooms', roomId), roomData)
    for (const [index, question] of questions.entries()) {
      await setDoc(doc(db, 'rooms', roomId, 'questions', String(index)), { ...question, order: index })
    }
    return { roomId, code, roomData }
  },

  async startQuestion(roomId: string): Promise<void> {
    await updateDoc(doc(db, 'rooms', roomId), {
      status: 'question',
      questionStartedAt: Date.now(),
    })
  },

  async applyRankingXp(roomId: string, currentQuestion: number, players: Player[]): Promise<void> {
    const snap = await getDocs(
      query(collection(db, 'rooms', roomId, 'answers'), where('questionIndex', '==', currentQuestion))
    )
    const roundAnswers = snap.docs.map(document => document.data() as PlayerAnswer)
    for (const answer of roundAnswers) {
      if (answer.xpGained > 0) {
        const player = players.find(currentPlayer => currentPlayer.id === answer.playerId)
        if (player) {
          await updateDoc(doc(db, 'rooms', roomId, 'players', answer.playerId), {
            xp: player.xp + answer.xpGained,
          })
        }
      }
    }
    await updateDoc(doc(db, 'rooms', roomId), { status: 'ranking' })
  },

  async advanceQuestion(room: Room): Promise<void> {
    const next = room.currentQuestion + 1
    const isLast = next >= room.totalQuestions
    await updateDoc(doc(db, 'rooms', room.id), {
      status: isLast ? 'finished' : 'question',
      currentQuestion: isLast ? room.currentQuestion : next,
      questionStartedAt: isLast ? null : Date.now(),
    })
  },

  async finish(roomId: string): Promise<void> {
    await updateDoc(doc(db, 'rooms', roomId), { status: 'finished' })
  },

  async findByCode(code: string): Promise<Room | null> {
    const snap = await getDocs(
      query(collection(db, 'rooms'), where('code', '==', code.toUpperCase()))
    )
    if (snap.empty) return null
    const found = snap.docs[0]
    return { id: found.id, ...found.data() } as Room
  },

  async getQuestionByOrder(roomId: string, order: number): Promise<RoomQuestion | null> {
    const snap = await getDocs(
      query(collection(db, 'rooms', roomId, 'questions'), where('order', '==', order))
    )
    if (snap.empty) return null
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as RoomQuestion
  },

  subscribeToRoom(roomId: string, callback: (room: Room) => void): Unsubscribe {
    return onSnapshot(doc(db, 'rooms', roomId), snap => {
      if (snap.exists()) callback({ id: snap.id, ...snap.data() } as Room)
    })
  },

  subscribeToPlayers(roomId: string, callback: (players: Player[]) => void): Unsubscribe {
    return onSnapshot(
      query(collection(db, 'rooms', roomId, 'players'), orderBy('xp', 'desc')),
      snap => callback(snap.docs.map(document => ({ id: document.id, ...document.data() } as Player)))
    )
  },

  subscribeToAnswers(
    roomId: string,
    questionIndex: number,
    callback: (answers: PlayerAnswer[]) => void
  ): Unsubscribe {
    return onSnapshot(
      query(collection(db, 'rooms', roomId, 'answers'), where('questionIndex', '==', questionIndex)),
      snap => callback(snap.docs.map(document => document.data() as PlayerAnswer))
    )
  },
}
