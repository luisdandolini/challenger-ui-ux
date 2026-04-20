import type { Room, Player, PlayerAnswer } from '../../../lib/types'

interface Props {
  room: Room
  players: Player[]
  answers: PlayerAnswer[]
  onStartQuestion: () => void
  onShowRanking: () => void
  onNextQuestion: () => void
  onFinish: () => void
}

export default function AdminRoom({
  room, players, answers,
  onStartQuestion, onShowRanking, onNextQuestion, onFinish,
}: Props) {
  const isLast = room.currentQuestion >= room.totalQuestions - 1

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="bg-surface border border-border rounded-xl p-6 text-center">
        <p className="text-muted text-xs mb-2">Código da sala</p>
        <div className="text-5xl font-extrabold tracking-widest text-primary">{room.code}</div>
        <p className="text-muted text-xs mt-2">Compartilhe esse código com os jogadores</p>
      </div>

      {/* Status */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-bold">
            {room.status === 'waiting'  && '⏳ Aguardando jogadores'}
            {room.status === 'question' && `❓ Pergunta ${room.currentQuestion + 1} de ${room.totalQuestions}`}
            {room.status === 'ranking'  && '🏆 Ranking da rodada'}
            {room.status === 'finished' && '🎉 Partida encerrada'}
          </span>
          <span className="text-xs text-muted">{players.length} jogador{players.length !== 1 ? 'es' : ''}</span>
        </div>

        {/* Controls */}
        {room.status === 'waiting' && (
          <button
            onClick={onStartQuestion}
            disabled={players.length === 0}
            className="w-full py-3.5 bg-linear-to-r from-primary to-violet-400 text-white font-bold rounded-lg
              hover:opacity-85 active:scale-95 transition-all disabled:opacity-40"
          >
            Iniciar primeira pergunta →
          </button>
        )}
        {room.status === 'question' && (
          <button
            onClick={onShowRanking}
            className="w-full py-3.5 bg-linear-to-r from-warning to-orange-400 text-black font-bold rounded-lg
              hover:opacity-85 active:scale-95 transition-all"
          >
            Encerrar pergunta e mostrar ranking
          </button>
        )}
        {room.status === 'ranking' && (
          <button
            onClick={isLast ? onFinish : onNextQuestion}
            className="w-full py-3.5 bg-linear-to-r from-success to-emerald-400 text-black font-bold rounded-lg
              hover:opacity-85 active:scale-95 transition-all"
          >
            {isLast ? 'Encerrar partida' : 'Próxima pergunta →'}
          </button>
        )}
        {room.status === 'finished' && (
          <p className="text-center text-muted text-sm">Partida encerrada. Veja o ranking final abaixo.</p>
        )}
      </div>

      {/* Answers summary (during question) */}
      {room.status === 'question' && answers.length > 0 && (
        <div className="bg-surface border border-border rounded-xl p-4">
          <p className="text-xs text-muted mb-2">{answers.length} resposta{answers.length !== 1 ? 's' : ''} recebida{answers.length !== 1 ? 's' : ''}</p>
        </div>
      )}

      {/* Players ranking */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border font-bold text-sm">
          {room.status === 'ranking' || room.status === 'finished' ? '🏆 Ranking' : '👥 Jogadores'}
        </div>
        {players.length === 0 ? (
          <p className="text-center text-muted text-sm py-8">Nenhum jogador ainda...</p>
        ) : (
          players.map((p, i) => (
            <div key={p.id} className={`flex items-center gap-3 px-6 py-3 border-b border-border last:border-0 ${i === 0 ? 'bg-primary/5' : ''}`}>
              <span className="w-6 text-center text-sm font-bold text-muted">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}º`}
              </span>
              <span className="flex-1 font-semibold text-sm">{p.name}</span>
              <span className="text-xs font-bold text-primary">{p.xp} XP</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
