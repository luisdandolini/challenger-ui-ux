import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../features/admin'
import AdminLogin from '../features/admin/components/AdminLogin'
import AdminRoom from '../features/admin/components/AdminRoom'
import QuizList from '../features/admin/components/QuizList'
import QuizEditor from '../features/admin/components/QuizEditor'
import type { Quiz, RoomQuestion } from '../lib/types'

type AdminView = 'quizList' | 'quizCreate' | 'quizEdit'

export default function AdminPage() {
  const navigate = useNavigate()
  const [view, setView]           = useState<AdminView>('quizList')
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)

  const {
    user, loading, room, players, liveAnswers,
    login, logout, createRoom,
    startQuestion, showRanking, nextQuestion, finishRoom,
    quizzes, quizzesLoading, createQuiz, updateQuiz, removeQuiz,
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

  if (room) return (
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

  if (view === 'quizCreate') return (
    <QuizEditor
      onSave={async (title, questions) => {
        await createQuiz(title, questions)
        setView('quizList')
      }}
      onBack={() => setView('quizList')}
    />
  )

  if (view === 'quizEdit' && editingQuiz) return (
    <QuizEditor
      quiz={editingQuiz}
      onSave={async (title, questions) => {
        await updateQuiz(editingQuiz.id, title, questions)
        setEditingQuiz(null)
        setView('quizList')
      }}
      onBack={() => { setEditingQuiz(null); setView('quizList') }}
    />
  )

  return (
    <QuizList
      quizzes={quizzes}
      loading={quizzesLoading}
      adminEmail={user.email ?? ''}
      onStartRoom={async (quiz: Quiz) => {
        await createRoom(quiz.questions as Omit<RoomQuestion, 'id'>[])
      }}
      onCreateQuiz={() => setView('quizCreate')}
      onEditQuiz={(quiz: Quiz) => { setEditingQuiz(quiz); setView('quizEdit') }}
      onDeleteQuiz={removeQuiz}
      onLogout={logout}
    />
  )
}
