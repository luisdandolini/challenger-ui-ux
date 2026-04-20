import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRoom } from '../features/room'
import PlayerRoom from '../features/room/components/PlayerRoom'

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate   = useNavigate()
  const { room, player, question, players, answered, streak, subscribeToRoom, submitAnswer, clearPlayer } = useRoom()

  useEffect(() => {
    if (!roomId) { navigate('/'); return }
    if (!player) { navigate('/join'); return }
    const unsub = subscribeToRoom(roomId)
    return unsub
  }, [roomId])

  const handleLeave = () => {
    clearPlayer()
    navigate('/')
  }

  if (!player || !room) return (
    <div className="min-h-screen flex items-center justify-center text-muted text-sm">
      Carregando sala...
    </div>
  )

  return (
    <PlayerRoom
      room={room}
      player={player}
      question={question}
      players={players}
      answered={answered}
      streak={streak}
      onAnswer={submitAnswer}
      onLeave={handleLeave}
    />
  )
}
