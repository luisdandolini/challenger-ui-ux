import { useGameState } from './features/quiz'
import { useRanking } from './features/ranking'
import { Home } from './features/home'
import { Quiz } from './features/quiz'
import { Result } from './features/result'
import { useAdmin, AdminLogin, AdminRoom, RoomCreator } from './features/admin'
import { useRoom, JoinRoom, PlayerRoom } from './features/room'

type AppMode = 'home' | 'admin' | 'join'

import { useState } from 'react'

export default function App() {
  const [mode, setMode] = useState<AppMode>('home')

  // Solo quiz
  const { state, startGame, answer, reset } = useGameState()
  const { ranking, saveScore, clearRanking } = useRanking()
  const handleFinish = () => saveScore(state.playerName, state.xp, state.earnedBadges)

  // Admin / multiplayer
  const { user, loading, room, players, answers, login, logout, createRoom, startQuestion, showRanking, nextQuestion, finishRoom } = useAdmin()
  const { room: playerRoom, player, question, players: roomPlayers, answered, streak, error: roomError, joinRoom, submitAnswer } = useRoom()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-muted text-sm">
      Carregando...
    </div>
  )

  // ── Admin flow ─────────────────────────────────────────────
  if (mode === 'admin') {
    if (!user) return <AdminLogin onLogin={login} />
    if (!room) return (
      <RoomCreator
        adminEmail={user.email ?? ''}
        onCreateRoom={async (qs) => { await createRoom(qs) }}
        onLogout={logout}
      />
    )
    return (
      <AdminRoom
        room={room}
        players={players}
        answers={answers}
        onStartQuestion={startQuestion}
        onShowRanking={showRanking}
        onNextQuestion={nextQuestion}
        onFinish={finishRoom}
      />
    )
  }

  // ── Player / join flow ─────────────────────────────────────
  if (mode === 'join') {
    if (!player || !playerRoom) return <JoinRoom onJoin={joinRoom} error={roomError} />
    return (
      <PlayerRoom
        room={playerRoom}
        player={player}
        question={question}
        players={roomPlayers}
        answered={answered}
        streak={streak}
        onAnswer={submitAnswer}
      />
    )
  }

  // ── Solo quiz flow ─────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      {state.phase === 'home' && (
        <Home
          onStart={startGame}
          ranking={ranking}
          onClearRanking={clearRanking}
          onJoinRoom={() => setMode('join')}
          onAdminArea={() => setMode('admin')}
        />
      )}
      {state.phase === 'quiz'   && <Quiz   state={state} onAnswer={answer} />}
      {state.phase === 'result' && <Result state={state} onRestart={reset} onFinish={handleFinish} ranking={ranking} />}
    </div>
  )
}
