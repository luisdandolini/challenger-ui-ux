import { useAuth } from './useAuth'
import { useAdminRoom } from './useAdminRoom'

export function useAdmin() {
  const { user, loading, login, logout: authLogout } = useAuth()
  const adminRoom = useAdminRoom(user)

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
  }
}
