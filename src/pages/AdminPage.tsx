import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../features/admin'
import AdminLogin from '../features/admin/components/AdminLogin'
import RoomCreator from '../features/admin/components/RoomCreator'
import AdminRoom from '../features/admin/components/AdminRoom'

export default function AdminPage() {
  const navigate = useNavigate()
  const {
    user, loading, room, players, answers,
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
      onLogin={login}
      onBack={() => navigate('/')}
    />
  )

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
