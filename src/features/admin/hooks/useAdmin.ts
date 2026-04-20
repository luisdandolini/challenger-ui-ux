import { useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged, type User,
} from 'firebase/auth'
import {
  collection, doc, setDoc, updateDoc, onSnapshot,
  query, orderBy, getDocs,
} from 'firebase/firestore'
import { auth, db } from '../../../lib/firebase'
import type { Room, RoomQuestion, Player, PlayerAnswer } from '../../../lib/types'

const XP_TABLE = { facil: 10, medio: 20, dificil: 35 } as const
const SPEED_BONUS = 8

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

const ROOM_KEY = 'admin_room_id'

export function useAdmin() {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [room, setRoom]       = useState<Room | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [answers, setAnswers] = useState<PlayerAnswer[]>([])

  useEffect(() => {
    return onAuthStateChanged(auth, async u => {
      setUser(u)
      if (u) {
        const savedId = sessionStorage.getItem(ROOM_KEY)
        if (savedId) {
          const snap = await getDocs(collection(db, 'rooms'))
          const found = snap.docs.find(d => d.id === savedId)
          if (found) setRoom({ id: found.id, ...found.data() } as Room)
        }
      }
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!room?.id) return
    const unsub = onSnapshot(doc(db, 'rooms', room.id), snap => {
      if (snap.exists()) setRoom({ id: snap.id, ...snap.data() } as Room)
    })
    const unsubPlayers = onSnapshot(
      query(collection(db, 'rooms', room.id, 'players'), orderBy('xp', 'desc')),
      snap => setPlayers(snap.docs.map(d => ({ id: d.id, ...d.data() } as Player)))
    )
    return () => { unsub(); unsubPlayers() }
  }, [room?.id])

  const login = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password)

  const logout = () => {
    sessionStorage.removeItem(ROOM_KEY)
    setRoom(null)
    return signOut(auth)
  }

  const createRoom = async (questions: Omit<RoomQuestion, 'id'>[]) => {
    if (!user) throw new Error('Não autenticado')
    const roomId = doc(collection(db, 'rooms')).id
    const code   = generateCode()

    const roomData: Omit<Room, 'id'> = {
      code,
      adminId:         user.uid,
      adminName:       user.email ?? 'Admin',
      status:          'waiting',
      currentQuestion: 0,
      totalQuestions:  questions.length,
      createdAt:       Date.now(),
    }

    await setDoc(doc(db, 'rooms', roomId), roomData)
    for (const [i, q] of questions.entries()) {
      await setDoc(doc(db, 'rooms', roomId, 'questions', String(i)), { ...q, order: i })
    }

    sessionStorage.setItem(ROOM_KEY, roomId)
    setRoom({ id: roomId, ...roomData })
    return { roomId, code }
  }

  const startQuestion = async () => {
    if (!room) return
    await updateDoc(doc(db, 'rooms', room.id), { status: 'question' })
  }

  const showRanking = async () => {
    if (!room) return
    const snap = await getDocs(collection(db, 'rooms', room.id, 'answers'))
    const roundAnswers = snap.docs
      .map(d => d.data() as PlayerAnswer)
      .filter(a => a.questionIndex === room.currentQuestion)

    setAnswers(roundAnswers)

    for (const a of roundAnswers) {
      if (a.xpGained > 0) {
        const player = players.find(p => p.id === a.playerId)
        if (player) {
          await updateDoc(doc(db, 'rooms', room.id, 'players', a.playerId), {
            xp: player.xp + a.xpGained,
          })
        }
      }
    }

    await updateDoc(doc(db, 'rooms', room.id), { status: 'ranking' })
  }

  const nextQuestion = async () => {
    if (!room) return
    const next = room.currentQuestion + 1
    const isLast = next >= room.totalQuestions
    await updateDoc(doc(db, 'rooms', room.id), {
      status:          isLast ? 'finished' : 'question',
      currentQuestion: isLast ? room.currentQuestion : next,
    })
    setAnswers([])
  }

  const finishRoom = async () => {
    if (!room) return
    sessionStorage.removeItem(ROOM_KEY)
    await updateDoc(doc(db, 'rooms', room.id), { status: 'finished' })
    setRoom(null)
  }

  return {
    user, loading, room, players, answers,
    login, logout, createRoom,
    startQuestion, showRanking, nextQuestion, finishRoom,
  }
}
