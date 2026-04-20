export type RoomStatus = 'waiting' | 'question' | 'ranking' | 'finished'

export interface Room {
  id: string
  code: string
  adminId: string
  adminName: string
  status: RoomStatus
  currentQuestion: number   // index da pergunta atual
  totalQuestions: number
  createdAt: number
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

export interface PlayerAnswer {
  playerId: string
  playerName: string
  questionIndex: number
  answer: number
  correct: boolean
  xpGained: number
  timeMs: number
}
