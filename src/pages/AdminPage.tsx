import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../features/admin'
import AdminLogin from '../features/admin/components/AdminLogin'
import RoomCreator from '../features/admin/components/RoomCreator'
import AdminRoom from '../features/admin/components/AdminRoom'

export default function AdminPage() {
  const navigate = useNavigate()
  const {
    user, loading, room, players, liveAnswers,
    login, logout, createRoom,
    startQuestion, showRanking, nextQuestion, finishRoom,
  } = useAdmin()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-muted text-sm">
      Carregando...
    </div>
  )

  if (!user) return (
    <AdminLogin
      onLogin={async (email, password) => { await login(email, password) }}
      onBack={() => navigate('/')}
    />
  )

  if (!room) return (
    <RoomCreator
      adminEmail={user.email ?? ''}
      onCreateRoom={createRoom}
      onLogout={logout}
    />
  )

  return (
    <AdminRoom
      room={room}
      players={players}
      liveAnswers={liveAnswers}
      onStartQuestion={startQuestion}
      onShowRanking={showRanking}
      onNextQuestion={nextQuestion}
      onFinish={finishRoom}
    />
  )
}
