import { useState, useCallback } from 'react'
import type { Badge } from '../../quiz/data/questions'

export interface RankingEntry {
  name: string
  xp: number
  badges: Badge[]
  date: number
}

const KEY = 'uiux_ranking'

function loadRanking(): RankingEntry[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') as RankingEntry[] }
  catch { return [] }
}

export function useRanking() {
  const [ranking, setRanking] = useState<RankingEntry[]>(loadRanking)

  const saveScore = useCallback((name: string, xp: number, badges: Badge[]) => {
    setRanking(prev => {
      const existing = prev.findIndex(p => p.name.toLowerCase() === name.toLowerCase())
      let next = [...prev]
      if (existing >= 0) {
        if (xp > next[existing].xp) next[existing] = { name, xp, badges, date: Date.now() }
      } else {
        next.push({ name, xp, badges, date: Date.now() })
      }
      next.sort((a, b) => b.xp - a.xp)
      next = next.slice(0, 50)
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clearRanking = useCallback(() => {
    localStorage.removeItem(KEY)
    setRanking([])
  }, [])

  return { ranking, saveScore, clearRanking }
}
