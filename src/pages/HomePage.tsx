import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-8">
      <div className="text-center animate-fade-in">
        <div className="text-6xl mb-4">🎮</div>
        <h1 className="text-4xl font-extrabold mb-2 bg-linear-to-br from-primary to-secondary bg-clip-text text-transparent">
          Challenger
        </h1>
        <p className="text-muted text-base max-w-xs mx-auto">
          Quiz gamificado em tempo real para sua turma
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs animate-fade-in">
        <button
          onClick={() => navigate('/join')}
          className="w-full py-4 bg-linear-to-r from-primary to-violet-400 text-white font-bold text-base
            rounded-xl hover:opacity-85 active:scale-95 transition-all"
        >
          🎮 Entrar em sala
        </button>
        <button
          onClick={() => navigate('/admin')}
          className="w-full py-4 bg-surface border border-border text-white font-bold text-base
            rounded-xl hover:border-primary transition-all"
        >
          🔑 Área do professor
        </button>
      </div>
    </div>
  )
}
