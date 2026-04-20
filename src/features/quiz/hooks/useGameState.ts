import { useState, useCallback, useRef } from 'react'
import { questions, XP_TABLE, SPEED_BONUS, STREAK_BONUS, BADGES, LEVELS, type Badge, type Question } from '../data/questions'

export interface Answer {
  questionId: number
  correct: boolean
  xpGained: number
  timeMs: number
}

export interface LastAnswer {
  correct: boolean
  xpGained: number
  elapsed: number
}

export type Phase = 'home' | 'quiz' | 'result'

export interface GameState {
  phase: Phase
  playerName: string
  queue: Question[]
  current: number
  xp: number
  streak: number
  maxStreak: number
  answers: Answer[]
  earnedBadges: Badge[]
  hardCorrect: number
  missStreak: number
  lastAnswer: LastAnswer | null
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function getLevel(xp: number) {
  return [...LEVELS].reverse().find(l => xp >= l.min) ?? LEVELS[0]
}

const initialState: GameState = {
  phase: 'home',
  playerName: '',
  queue: [],
  current: 0,
  xp: 0,
  streak: 0,
  maxStreak: 0,
  answers: [],
  earnedBadges: [],
  hardCorrect: 0,
  missStreak: 0,
  lastAnswer: null,
}

export function useGameState() {
  const [state, setState] = useState<GameState>(initialState)
  const startTimeRef = useRef<number>(Date.now())

  const startGame = useCallback((playerName: string) => {
    const queue = shuffle(questions)
    setState({ ...initialState, phase: 'quiz', playerName, queue, current: 0 })
    startTimeRef.current = Date.now()
  }, [])

  const answer = useCallback((optionIndex: number) => {
    const elapsed = (Date.now() - startTimeRef.current) / 1000

    setState(prev => {
      const q = prev.queue[prev.current]
      const correct = optionIndex === q.resposta
      let xpGained = 0
      const newBadges: Badge[] = [...prev.earnedBadges]
      const newStreak = correct ? prev.streak + 1 : 0
      const newMaxStreak = Math.max(prev.maxStreak, newStreak)
      const newHardCorrect = prev.hardCorrect + (correct && q.nivel === 'dificil' ? 1 : 0)
      const newMissStreak = correct ? 0 : prev.missStreak + 1

      if (correct) {
        xpGained = XP_TABLE[q.nivel]
        if (elapsed <= SPEED_BONUS.threshold) xpGained += SPEED_BONUS.xp
        if (newStreak >= STREAK_BONUS.threshold) xpGained = Math.round(xpGained * STREAK_BONUS.multiplier)
      }

      const addBadge = (id: string) => {
        if (!newBadges.find(b => b.id === id)) {
          const badge = BADGES.find(b => b.id === id)
          if (badge) newBadges.push(badge)
        }
      }

      if (prev.answers.length === 0 && correct) addBadge('first_blood')
      if (newStreak >= 3) addBadge('streak_3')
      if (newStreak >= 5) addBadge('streak_5')
      if (elapsed <= 3 && correct) addBadge('speedster')
      if (newHardCorrect >= 3) addBadge('hard_master')
      if (prev.missStreak >= 3 && correct) addBadge('comeback')

      const newAnswers: Answer[] = [...prev.answers, { questionId: q.id, correct, xpGained, timeMs: elapsed * 1000 }]
      const nextIndex = prev.current + 1
      const isLast = nextIndex >= prev.queue.length

      if (isLast && newAnswers.every(a => a.correct)) addBadge('perfect')

      return {
        ...prev,
        current: nextIndex,
        xp: prev.xp + xpGained,
        streak: newStreak,
        maxStreak: newMaxStreak,
        answers: newAnswers,
        earnedBadges: newBadges,
        hardCorrect: newHardCorrect,
        missStreak: newMissStreak,
        phase: isLast ? 'result' : 'quiz',
        lastAnswer: { correct, xpGained, elapsed },
      }
    })

    startTimeRef.current = Date.now()
  }, [])

  const reset = useCallback(() => setState(initialState), [])

  return { state, startGame, answer, reset }
}
