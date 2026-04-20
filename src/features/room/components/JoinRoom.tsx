import { useState } from 'react'

interface Props {
  onJoin: (code: string, name: string) => Promise<void>
  error: string
  onBack: () => void
}

export default function JoinRoom({ onJoin, error, onBack }: Props) {
  const [code, setCode]   = useState('')
  const [name, setName]   = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async () => {
    if (!code.trim() || !name.trim()) return
    setLoading(true)
    await onJoin(code, name)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-surface border border-border rounded-xl p-10 animate-fade-in">
        <button onClick={onBack} className="text-xs text-muted hover:text-white mb-6 block transition-colors">
          ← Voltar
        </button>
        <h1 className="text-2xl font-extrabold mb-1 bg-linear-to-br from-primary to-secondary bg-clip-text text-transparent">
          Entrar na sala
        </h1>
        <p className="text-muted text-sm mb-8">Digite o código da sala e seu nome</p>

        <div className="flex flex-col gap-4">
          <input
            className="w-full px-4 py-3 bg-surface2 border border-border rounded-lg text-white text-sm
              outline-none focus:border-primary transition-colors tracking-widest uppercase text-center font-bold text-lg"
            placeholder="CÓDIGO"
            value={code}
            maxLength={6}
            onChange={e => setCode(e.target.value.toUpperCase())}
          />
          <input
            className="w-full px-4 py-3 bg-surface2 border border-border rounded-lg text-white text-sm
              outline-none focus:border-primary transition-colors"
            placeholder="Seu nome"
            value={name}
            maxLength={30}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handle()}
          />
          {error && <p className="text-danger text-xs">{error}</p>}
          <button
            onClick={handle}
            disabled={loading || !code.trim() || !name.trim()}
            className="w-full py-3.5 bg-linear-to-r from-primary to-violet-400 text-white font-bold rounded-lg
              hover:opacity-85 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar →'}
          </button>
        </div>
      </div>
    </div>
  )
}
