export type RoomStatus = 'waiting' | 'question' | 'ranking' | 'finished'

export interface Room {
  id: string
  code: string
  adminId: string
  adminName: string
  status: RoomStatus
  currentQuestion: number
  totalQuestions: number
  createdAt: number
  questionStartedAt?: number  // timestamp quando a pergunta foi iniciada
  questionDuration: number    // segundos por pergunta
}

export interface RoomQuestion {
  id: string
  order: number
  pergunta: string
  opcoes: string[]
  resposta: number
  nivel: 'facil' | 'medio' | 'dificil'
  explicacao?: string
}

export interface Player {
  id: string
  name: string
  xp: number
  joinedAt: number
}

export interface Quiz {
  id: string
  title: string
  adminId: string
  createdAt: number
  questions: Omit<RoomQuestion, 'id'>[]
}

export interface PlayerAnswer {
  playerId: string
  playerName: string
  questionIndex: number
  answer: number
  correct: boolean
  xpGained: number
  timeMs: number
}
