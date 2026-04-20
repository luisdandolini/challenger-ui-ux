import { useState } from 'react'
import { getLevel } from '../../quiz/hooks/useGameState'
import { LEVELS } from '../../quiz/data/questions'
import type { RankingEntry } from '../../ranking/hooks/useRanking'

interface Props {
  onStart: (name: string) => void
  ranking: RankingEntry[]
  onClearRanking: () => void
}

const medals = ['🥇', '🥈', '🥉']

export default function Home({ onStart, ranking, onClearRanking }: Props) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleStart = () => {
    const trimmed = name.trim()
    if (!trimmed) { setError('Digite seu nome para continuar'); return }
    setError('')
    onStart(trimmed)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 gap-8">

      <div className="w-full max-w-md bg-surface border border-border rounded-xl p-10 animate-fade-in">
        <h1 className="text-3xl font-extrabold text-center mb-1.5 bg-linear-to-br from-primary to-secondary bg-clip-text text-transparent">
          UI/UX Challenger 🎮
        </h1>
        <p className="text-center text-muted text-sm mb-8">
          Teste seus conhecimentos em design e suba no ranking!
        </p>

        <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">
          Seu nome ou apelido
        </label>
        <input
          className={`w-full px-4 py-3.5 bg-surface2 rounded-lg text-base text-white outline-none transition-colors
            border ${error ? 'border-danger' : 'border-border'} focus:border-primary`}
          placeholder="ex: Lucas Design"
          value={name}
          maxLength={30}
          onChange={e => { setName(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleStart()}
        />
        {error && <p className="text-danger text-xs mt-1.5">{error}</p>}

        <button
          onClick={handleStart}
          className="mt-5 w-full py-4 bg-linear-to-r from-primary to-violet-400 text-white font-bold text-base
            rounded-lg hover:opacity-85 active:scale-95 transition-all"
        >
          Iniciar Quiz →
        </button>

        <div className="mt-6 flex flex-wrap gap-2">
          {LEVELS.map(l => (
            <span
              key={l.label}
              className="text-[11px] font-semibold px-3 py-1 rounded-full bg-surface2"
              style={{ color: l.color }}
            >
              {l.icon} {l.label}
            </span>
          ))}
        </div>
      </div>

      {ranking.length > 0 && (
        <div className="w-full max-w-md bg-surface border border-border rounded-xl overflow-hidden animate-fade-in">
          <div className="flex justify-between items-center px-6 py-4 border-b border-border font-bold">
            <span>🏆 Ranking</span>
            <button
              onClick={onClearRanking}
              className="text-xs text-muted hover:text-white transition-colors"
            >
              Limpar
            </button>
          </div>

          {ranking.slice(0, 10).map((p, i) => {
            const lv = getLevel(p.xp)
            return (
              <div
                key={i}
                className={`flex items-center gap-3 px-6 py-3 border-b border-border last:border-0
                  ${i === 0 ? 'bg-primary/5' : ''}`}
              >
                <span className="w-6 text-xs font-bold text-muted text-center">
                  {medals[i] ?? `${i + 1}º`}
                </span>
                <span className="flex-1 font-semibold text-sm">{p.name}</span>
                <span className="text-xs font-medium" style={{ color: lv.color }}>
                  {lv.icon} {lv.label}
                </span>
                <span className="text-xs font-bold text-primary">{p.xp} XP</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
