import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRoom } from '../features/room'
import JoinRoom from '../features/room/components/JoinRoom'

export default function JoinPage() {
  const navigate = useNavigate()
  const { player, room, error, joinRoom } = useRoom()

  useEffect(() => {
    if (player && room) navigate(`/room/${room.id}`)
  }, [player, room, navigate])

  const handleJoin = async (code: string, name: string) => {
    const roomId = await joinRoom(code, name)
    if (roomId) navigate(`/room/${roomId}`)
  }

  return <JoinRoom onJoin={handleJoin} error={error} onBack={() => navigate('/')} />
}
