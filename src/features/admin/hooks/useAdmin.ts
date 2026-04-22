import { useAuth } from './useAuth'
import { useAdminRoom } from './useAdminRoom'
import { useQuizzes } from './useQuizzes'

export function useAdmin() {
  const { user, loading, login, logout: authLogout } = useAuth()
  const adminRoom = useAdminRoom(user)
  const quizzes   = useQuizzes(user?.uid ?? null)

  const logout = () => {
    adminRoom.clearRoom()
    return authLogout()
  }

  return {
    user, loading,
    room:        adminRoom.room,
    players:     adminRoom.players,
    liveAnswers: adminRoom.liveAnswers,
    login,
    logout,
    createRoom:    adminRoom.createRoom,
    startQuestion: adminRoom.startQuestion,
    showRanking:   adminRoom.showRanking,
    nextQuestion:  adminRoom.nextQuestion,
    finishRoom:    adminRoom.finishRoom,
    quizzes:       quizzes.quizzes,
    quizzesLoading: quizzes.loading,
    createQuiz:    quizzes.createQuiz,
    updateQuiz:    quizzes.updateQuiz,
    removeQuiz:    quizzes.removeQuiz,
  }
}
