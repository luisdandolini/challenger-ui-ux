import { useState, useEffect, useRef } from 'react'
import type { Room, Player, PlayerAnswer } from '../../../lib/types'

interface Props {
  room: Room
  players: Player[]
  liveAnswers: PlayerAnswer[]
  onStartQuestion: () => void
  onShowRanking: () => void
  onNextQuestion: () => void
  onFinish: () => void
}

const OPTION_COLORS = ['#7c6af7', '#f7836a', '#4ade80', '#fbbf24']
const OPTION_LABELS = ['A', 'B', 'C', 'D']

function useTimer(room: Room) {
  const [timeLeft, setTimeLeft] = useState(room.questionDuration)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (room.status !== 'question' || !room.questionStartedAt) {
      if (ref.current) clearInterval(ref.current)
      setTimeLeft(room.questionDuration)
      return
    }
    const tick = () => {
      const elapsed = (Date.now() - room.questionStartedAt!) / 1000
      const left    = Math.max(0, room.questionDuration - Math.floor(elapsed))
      setTimeLeft(left)
      if (left <= 0 && ref.current) clearInterval(ref.current)
    }
    tick()
    ref.current = setInterval(tick, 500)
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [room.status, room.questionStartedAt, room.questionDuration])

  return timeLeft
}

function AnswerChart({ liveAnswers, totalPlayers }: { liveAnswers: PlayerAnswer[], totalPlayers: number }) {
  const counts = [0, 1, 2, 3].map(i => liveAnswers.filter(a => a.answer === i).length)
  const max    = Math.max(...counts, 1)

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-bold">Respostas em tempo real</span>
        <span className="text-xs text-muted">
          {liveAnswers.length}/{totalPlayers} responderam
        </span>
      </div>
      <div className="flex items-end gap-3 h-24">
        {counts.map((count, i) => {
          const pct = totalPlayers > 0 ? Math.round((count / totalPlayers) * 100) : 0
          const height = max > 0 ? (count / max) * 100 : 0
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-muted">{pct}%</span>
              <div className="w-full rounded-t-md transition-all duration-300" style={{
                height: `${Math.max(height, 4)}%`,
                minHeight: 4,
                background: OPTION_COLORS[i],
                opacity: count === 0 ? 0.3 : 1,
              }} />
              <span className="text-xs font-bold" style={{ color: OPTION_COLORS[i] }}>
                {OPTION_LABELS[i]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function AdminRoom({
  room, players, liveAnswers,
  onStartQuestion, onShowRanking, onNextQuestion, onFinish,
}: Props) {
  const isLast   = room.currentQuestion >= room.totalQuestions - 1
  const timeLeft = useTimer(room)
  const timerPct = (timeLeft / room.questionDuration) * 100
  const timerColor = timeLeft > 10 ? '#7c6af7' : timeLeft > 5 ? '#fbbf24' : '#f87171'

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto flex flex-col gap-5">

      {/* Code header */}
      <div className="bg-surface border border-border rounded-xl p-6 text-center">
        <p className="text-muted text-xs mb-2">Código da sala</p>
        <div className="text-5xl font-extrabold tracking-widest text-primary">{room.code}</div>
        <p className="text-muted text-xs mt-2">Compartilhe esse código com os alunos</p>
      </div>

      {/* Status + controls */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-bold">
            {room.status === 'waiting'  && '⏳ Aguardando alunos'}
            {room.status === 'question' && `❓ Pergunta ${room.currentQuestion + 1} de ${room.totalQuestions}`}
            {room.status === 'ranking'  && '🏆 Ranking da rodada'}
            {room.status === 'finished' && '🎉 Partida encerrada'}
          </span>
          <span className="text-xs text-muted">
            {players.length} aluno{players.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Timer bar */}
        {room.status === 'question' && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-muted">Tempo restante</span>
              <span className="text-sm font-bold" style={{ color: timerColor }}>
                {timeLeft}s
              </span>
            </div>
            <div className="h-2 bg-surface2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${timerPct}%`, background: timerColor }}
              />
            </div>
          </div>
        )}

        {/* Controls */}
        {room.status === 'waiting' && (
          <button
            onClick={onStartQuestion}
            disabled={players.length === 0}
            className="w-full py-3.5 bg-linear-to-r from-primary to-violet-400 text-white font-bold rounded-lg
              hover:opacity-85 active:scale-95 transition-all disabled:opacity-40"
          >
            Iniciar primeira pergunta →
          </button>
        )}
        {room.status === 'question' && (
          <button
            onClick={onShowRanking}
            className="w-full py-3.5 bg-linear-to-r from-warning to-orange-400 text-black font-bold rounded-lg
              hover:opacity-85 active:scale-95 transition-all"
          >
            Encerrar pergunta e mostrar ranking
          </button>
        )}
        {room.status === 'ranking' && (
          <button
            onClick={isLast ? onFinish : onNextQuestion}
            className="w-full py-3.5 bg-linear-to-r from-success to-emerald-400 text-black font-bold rounded-lg
              hover:opacity-85 active:scale-95 transition-all"
          >
            {isLast ? 'Encerrar partida' : 'Próxima pergunta →'}
          </button>
        )}
        {room.status === 'finished' && (
          <p className="text-center text-muted text-sm">Partida encerrada. Veja o ranking final abaixo.</p>
        )}
      </div>

      {/* Live answer chart */}
      {room.status === 'question' && (
        <AnswerChart liveAnswers={liveAnswers} totalPlayers={players.length} />
      )}

      {/* Players list */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border font-bold text-sm">
          {room.status === 'ranking' || room.status === 'finished' ? '🏆 Ranking' : '👥 Alunos'}
        </div>
        {players.length === 0 ? (
          <p className="text-center text-muted text-sm py-8">Nenhum aluno ainda...</p>
        ) : (
          players.map((p, i) => (
            <div
              key={p.id}
              className={`flex items-center gap-3 px-6 py-3 border-b border-border last:border-0
                ${i === 0 ? 'bg-primary/5' : ''}`}
            >
              <span className="w-6 text-center text-sm font-bold text-muted">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}º`}
              </span>
              <span className="flex-1 font-semibold text-sm">{p.name}</span>
              {room.status === 'question' && (
                <span className="text-xs text-muted">
                  {liveAnswers.find(a => a.playerId === p.id) ? '✅' : '⏳'}
                </span>
              )}
              <span className="text-xs font-bold text-primary">{p.xp} XP</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
