import { useGameState } from './features/quiz'
import { useRanking } from './features/ranking'
import { Home } from './features/home'
import { Quiz } from './features/quiz'
import { Result } from './features/result'

export default function App() {
  const { state, startGame, answer, reset } = useGameState()
  const { ranking, saveScore, clearRanking } = useRanking()

  const handleFinish = () => saveScore(state.playerName, state.xp, state.earnedBadges)

  return (
    <div className="min-h-screen flex flex-col">
      {state.phase === 'home'   && <Home   onStart={startGame} ranking={ranking} onClearRanking={clearRanking} />}
      {state.phase === 'quiz'   && <Quiz   state={state} onAnswer={answer} />}
      {state.phase === 'result' && <Result state={state} onRestart={reset} onFinish={handleFinish} ranking={ranking} />}
    </div>
  )
}
