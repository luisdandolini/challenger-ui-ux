import { useEffect, useRef } from 'react'
import { getLevel, type GameState } from '../../quiz/hooks/useGameState'
import { questions } from '../../quiz/data/questions'
import type { RankingEntry } from '../../ranking/hooks/useRanking'

interface Props {
  state: GameState
  onRestart: () => void
  onFinish: () => void
  ranking: RankingEntry[]
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-surface2 rounded-xl p-4">
      <div className="text-2xl font-extrabold" style={{ color }}>{value}</div>
      <div className="text-xs text-muted mt-1">{label}</div>
    </div>
  )
}

export default function Result({ state, onRestart, onFinish, ranking }: Props) {
  const { playerName, xp, earnedBadges, answers, maxStreak } = state
  const savedRef = useRef(false)
  const lv = getLevel(xp)
  const correct = answers.filter(a => a.correct).length
  const total = answers.length
  const pct = Math.round((correct / total) * 100)

  useEffect(() => {
    if (!savedRef.current) { onFinish(); savedRef.current = true }
  }, [onFinish])

  const myRank = ranking.findIndex(r => r.name.toLowerCase() === playerName.toLowerCase()) + 1
  const trophy   = pct === 100 ? '🏆' : pct >= 70 ? '🎉' : pct >= 40 ? '💪' : '📚'
  const headline = pct === 100 ? 'Perfeito!' : pct >= 70 ? 'Muito bem!' : pct >= 40 ? 'Continue praticando!' : 'Estude mais!'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 gap-6 animate-fade-in">
      {/* Main card */}
      <div className="w-full max-w-lg bg-surface border border-border rounded-xl p-10 text-center">
        <div className="text-6xl mb-3 animate-pop">{trophy}</div>
        <h2 className="text-2xl font-extrabold mb-1">{headline}</h2>
        <p className="text-muted text-sm mb-7">{playerName}</p>

        <div className="grid grid-cols-2 gap-3 mb-7">
          <Stat label="Acertos"        value={`${correct}/${total}`} color="#4ade80" />
          <Stat label="XP Total"       value={`${xp} XP`}           color="#7c6af7" />
          <Stat label="Aproveitamento" value={`${pct}%`}            color="#fbbf24" />
          <Stat label="Streak máx."    value={`🔥 ${maxStreak}`}    color="#f7836a" />
        </div>

        {/* Level */}
        <div className="flex items-center justify-center gap-3 bg-surface2 rounded-xl p-4 mb-5">
          <span className="text-4xl">{lv.icon}</span>
          <div className="text-left">
            <div className="font-bold" style={{ color: lv.color }}>{lv.label}</div>
            <div className="text-xs text-muted">
              {myRank > 0 ? `#${myRank} no ranking` : 'No ranking'}
            </div>
          </div>
        </div>

        {/* Badges */}
        {earnedBadges.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-muted mb-3">Conquistas desbloqueadas</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {earnedBadges.map(b => (
                <span
                  key={b.id}
                  className="px-3.5 py-1.5 bg-primary/10 border border-primary/40 rounded-full text-xs font-semibold text-white animate-pop"
                >
                  {b.icon} {b.label}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onRestart}
          className="w-full py-4 bg-linear-to-r from-primary to-violet-400 text-white font-bold text-base
            rounded-lg hover:opacity-85 active:scale-95 transition-all"
        >
          Jogar Novamente
        </button>
      </div>

      {/* Breakdown */}
      <div className="w-full max-w-lg bg-surface border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border font-bold text-sm">Detalhamento</div>
        {answers.map((a, i) => {
          const q = questions.find(q => q.id === a.questionId)
          return (
            <div key={i} className="flex items-start gap-3 px-6 py-3 border-b border-border last:border-0">
              <span className="text-base mt-0.5">{a.correct ? '✅' : '❌'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium mb-0.5 truncate">{q?.pergunta}</p>
                <p className="text-[11px] text-muted">
                  {(a.timeMs / 1000).toFixed(1)}s
                  {a.xpGained > 0 && <span className="text-primary ml-2">+{a.xpGained} XP</span>}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
