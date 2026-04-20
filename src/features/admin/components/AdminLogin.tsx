import { useState } from 'react'

interface Props {
  onLogin: (email: string, password: string) => Promise<void>
}

export default function AdminLogin({ onLogin }: Props) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handle = async () => {
    if (!email || !password) { setError('Preencha todos os campos'); return }
    setLoading(true)
    setError('')
    try {
      await onLogin(email, password)
    } catch {
      setError('E-mail ou senha incorretos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-surface border border-border rounded-xl p-10 animate-fade-in">
        <h1 className="text-2xl font-extrabold mb-1 bg-linear-to-br from-primary to-secondary bg-clip-text text-transparent">
          Área do Admin
        </h1>
        <p className="text-muted text-sm mb-8">Faça login para criar e gerenciar salas</p>

        <div className="flex flex-col gap-4">
          <input
            className="w-full px-4 py-3 bg-surface2 border border-border rounded-lg text-white text-sm outline-none focus:border-primary transition-colors"
            placeholder="E-mail"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handle()}
          />
          <input
            className="w-full px-4 py-3 bg-surface2 border border-border rounded-lg text-white text-sm outline-none focus:border-primary transition-colors"
            placeholder="Senha"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handle()}
          />
          {error && <p className="text-danger text-xs">{error}</p>}
          <button
            onClick={handle}
            disabled={loading}
            className="w-full py-3.5 bg-linear-to-r from-primary to-violet-400 text-white font-bold rounded-lg
              hover:opacity-85 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </div>
    </div>
  )
}
