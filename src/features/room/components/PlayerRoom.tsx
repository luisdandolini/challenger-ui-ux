import { useState, useEffect, useRef } from 'react'
import type { Room, RoomQuestion, Player } from '../../../lib/types'

interface Props {
  room: Room
  player: Player
  question: RoomQuestion | null
  players: Player[]
  answered: boolean
  streak: number
  onAnswer: (idx: number) => void
  onLeave: () => void
}

const NIVEL_COLOR = { facil: '#4ade80', medio: '#fbbf24', dificil: '#f87171' }
const NIVEL_LABEL = { facil: 'Fácil', medio: 'Médio', dificil: 'Difícil' }
const QUESTION_TIME = 30

export default function PlayerRoom({ room, player, question, players, answered, streak, onAnswer, onLeave }: Props) {
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)
  const [selected, setSelected] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setSelected(null)
    setTimeLeft(QUESTION_TIME)
  }, [question?.id])

  useEffect(() => {
    if (room.status !== 'question' || answered) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current!); return 0 } return t - 1 })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [room.status, answered, question?.id])

  const handleAnswer = (idx: number) => {
    if (answered || selected !== null) return
    setSelected(idx)
    onAnswer(idx)
  }

  const myRank = players.findIndex(p => p.id === player.id) + 1

  // Waiting screen
  if (room.status === 'waiting') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-6 animate-fade-in">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-streak">⏳</div>
          <h2 className="text-xl font-bold mb-2">Aguardando o professor...</h2>
          <p className="text-muted text-sm">A partida vai começar em breve</p>
        </div>
        <div className="bg-surface border border-border rounded-xl px-8 py-4 text-center">
          <p className="text-xs text-muted mb-1">Você entrou como</p>
          <p className="font-bold text-lg">{player.name}</p>
        </div>
      </div>
    )
  }

  // Question screen
  if (room.status === 'question' && question) {
    const timerClass = timeLeft > 10 ? 'text-primary' : timeLeft > 5 ? 'text-warning' : 'text-danger'
    const optionClass = (idx: number) => {
      const base = 'w-full px-5 py-4 rounded-lg text-sm font-medium text-left border-[1.5px] transition-all'
      if (answered || selected !== null) {
        if (idx === question.resposta) return `${base} bg-success/10 border-success text-success`
        if (idx === selected)          return `${base} bg-danger/10 border-danger text-danger`
        return `${base} bg-surface2 border-border text-muted opacity-50`
      }
      return `${base} bg-surface2 border-border text-white hover:border-primary/50 cursor-pointer`
    }

    return (
      <div className="min-h-screen flex flex-col p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-muted">{player.name}</span>
          <div className="flex items-center gap-4">
            {streak >= 3 && <span className="text-sm font-bold text-warning animate-streak">🔥 ×{streak}</span>}
            <span className="text-sm font-bold text-primary">{player.xp} XP</span>
          </div>
        </div>

        <div className="h-1 bg-surface2 rounded-full mb-6">
          <div
            className="h-full bg-linear-to-r from-primary to-secondary rounded-full transition-all"
            style={{ width: `${((room.currentQuestion + 1) / room.totalQuestions) * 100}%` }}
          />
        </div>

        <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto gap-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: NIVEL_COLOR[question.nivel] + '20', color: NIVEL_COLOR[question.nivel] }}
            >
              {NIVEL_LABEL[question.nivel]}
            </span>
            <span className={`text-sm font-bold ${timerClass}`}>⏱ {timeLeft}s</span>
          </div>

          <div className="bg-surface border border-border rounded-xl px-6 py-7">
            <p className="text-[11px] text-muted mb-2">
              Pergunta {room.currentQuestion + 1} de {room.totalQuestions}
            </p>
            <p className="text-lg font-semibold leading-relaxed">{question.pergunta}</p>
          </div>

          <div className="flex flex-col gap-2.5">
            {question.opcoes.map((opt, idx) => (
              <button key={idx} className={optionClass(idx)} onClick={() => handleAnswer(idx)}>
                <span className="text-muted mr-2 text-xs">{String.fromCharCode(65 + idx)}.</span>
                {opt}
              </button>
            ))}
          </div>

          {(answered || selected !== null) && question.explicacao && (
            <div className="px-5 py-4 bg-primary/5 border border-primary/40 rounded-lg text-sm animate-fade-in">
              💡 {question.explicacao}
            </div>
          )}

          {(answered || selected !== null) && (
            <div className="text-center text-sm font-bold animate-pop">
              {selected === question.resposta
                ? <span className="text-success">Correto! ✓</span>
                : <span className="text-danger">Errou!</span>
              }
              <span className="text-muted ml-2">Aguardando o professor...</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Ranking screen
  if (room.status === 'ranking' || room.status === 'finished') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 gap-6 animate-fade-in">
        <div className="text-center">
          <div className="text-5xl mb-3 animate-pop">
            {room.status === 'finished' ? '🏆' : '📊'}
          </div>
          <h2 className="text-xl font-bold mb-1">
            {room.status === 'finished' ? 'Resultado final!' : `Ranking — Rodada ${room.currentQuestion + 1}`}
          </h2>
          {myRank > 0 && (
            <p className="text-muted text-sm">Você está em <span className="text-primary font-bold">#{myRank}</span></p>
          )}
        </div>

        <div className="w-full max-w-sm bg-surface border border-border rounded-xl overflow-hidden">
          {players.slice(0, 10).map((p, i) => (
            <div
              key={p.id}
              className={`flex items-center gap-3 px-6 py-3 border-b border-border last:border-0
                ${p.id === player.id ? 'bg-primary/10' : i === 0 ? 'bg-primary/5' : ''}`}
            >
              <span className="w-6 text-center text-sm font-bold text-muted">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}º`}
              </span>
              <span className="flex-1 font-semibold text-sm">
                {p.name} {p.id === player.id && <span className="text-primary text-xs">(você)</span>}
              </span>
              <span className="text-xs font-bold text-primary">{p.xp} XP</span>
            </div>
          ))}
        </div>

        {room.status === 'ranking' && (
          <p className="text-muted text-sm">Aguardando o professor...</p>
        )}
        {room.status === 'finished' && (
          <button
            onClick={onLeave}
            className="px-6 py-3 bg-surface border border-border rounded-lg text-sm font-semibold
              hover:border-primary transition-all"
          >
            Sair da sala
          </button>
        )}
      </div>
    )
  }

  return null
}
