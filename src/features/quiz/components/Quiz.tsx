import { useState, useEffect, useRef } from 'react'
import { getLevel, type GameState } from '../hooks/useGameState'
import { questions, type Nivel } from '../data/questions'

interface Props {
  state: GameState
  onAnswer: (idx: number) => void
}

const NIVEL_COLOR: Record<Nivel, string> = { facil: '#4ade80', medio: '#fbbf24', dificil: '#f87171' }
const NIVEL_LABEL: Record<Nivel, string> = { facil: 'Fácil', medio: 'Médio', dificil: 'Difícil' }
const QUESTION_TIME = 30

export default function Quiz({ state, onAnswer }: Props) {
  const { queue, current, xp, streak, playerName } = state
  const q = queue[current]
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setSelected(null)
    setRevealed(false)
    setTimeLeft(QUESTION_TIME)
  }, [current])

  useEffect(() => {
    if (revealed) { if (timerRef.current) clearInterval(timerRef.current); return }
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { if (timerRef.current) clearInterval(timerRef.current); handleSelect(-1); return 0 }
        return t - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [revealed, current])

  const handleSelect = (idx: number) => {
    if (revealed) return
    setSelected(idx)
    setRevealed(true)
    setTimeout(() => onAnswer(idx), 900)
  }

  const lv = getLevel(xp)
  const progress = (current / questions.length) * 100

  const optionClasses = (idx: number) => {
    const base = 'w-full px-5 py-4 rounded-lg text-sm font-medium text-left transition-all border-[1.5px]'
    if (revealed) {
      if (idx === q.resposta) return `${base} bg-success/10 border-success text-success animate-pop`
      if (idx === selected)   return `${base} bg-danger/10 border-danger text-danger`
    }
    if (selected === idx) return `${base} bg-primary/10 border-primary text-white`
    return `${base} bg-surface2 border-border text-white hover:border-primary/50 cursor-pointer`
  }

  const timerClass = timeLeft > 10 ? 'text-primary' : timeLeft > 5 ? 'text-warning' : 'text-danger'

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">{playerName}</span>
          <span className="text-sm font-bold" style={{ color: lv.color }}>{lv.icon} {lv.label}</span>
        </div>
        <div className="flex items-center gap-4">
          {streak >= 3 && (
            <span className="text-sm font-bold text-warning animate-streak">🔥 ×{streak}</span>
          )}
          <span className="text-sm font-bold text-primary">{xp} XP</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-surface2 rounded-full mb-6">
        <div
          className="h-full bg-linear-to-r from-primary to-secondary rounded-full transition-all duration-400"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto gap-4 animate-fade-in">
        {/* Meta row */}
        <div className="flex justify-between items-center">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: NIVEL_COLOR[q.nivel] + '20', color: NIVEL_COLOR[q.nivel] }}
          >
            {NIVEL_LABEL[q.nivel]}
          </span>
          <span className={`text-sm font-bold min-w-[40px] text-right ${timerClass}`}>
            ⏱ {timeLeft}s
          </span>
        </div>

        {/* Question */}
        <div className="bg-surface border border-border rounded-xl px-6 py-7">
          <p className="text-[11px] text-muted mb-2">Pergunta {current + 1} de {questions.length}</p>
          <p className="text-lg font-semibold leading-relaxed">{q.pergunta}</p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2.5">
          {q.opcoes.map((opt, idx) => (
            <button key={idx} className={optionClasses(idx)} onClick={() => handleSelect(idx)} disabled={revealed}>
              <span className="text-muted mr-2.5 text-xs">{String.fromCharCode(65 + idx)}.</span>
              {opt}
            </button>
          ))}
        </div>

        {/* Explanation */}
        {revealed && q.explicacao && (
          <div className="px-5 py-4 bg-primary/5 border border-primary/40 rounded-lg text-sm text-white/90 animate-fade-in">
            💡 {q.explicacao}
          </div>
        )}

        {/* XP feedback */}
        {revealed && state.lastAnswer && (
          <div className="text-center text-sm font-bold animate-pop">
            {state.lastAnswer.correct
              ? <span className="text-success">+{state.lastAnswer.xpGained} XP ✓</span>
              : <span className="text-danger">Errou! 0 XP</span>
            }
          </div>
        )}
      </div>
    </div>
  )
}
