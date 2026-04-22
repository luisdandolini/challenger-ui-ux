import { useState } from 'react'
import type { Quiz, RoomQuestion } from '../../../lib/types'

interface Props {
  quiz?: Quiz
  onSave: (title: string, questions: Omit<RoomQuestion, 'id'>[]) => Promise<void>
  onBack: () => void
}

const emptyQuestion = (): Omit<RoomQuestion, 'id' | 'order'> => ({
  pergunta: '',
  opcoes: ['', '', '', ''],
  resposta: 0,
  nivel: 'facil',
  explicacao: '',
})

export default function QuizEditor({ quiz, onSave, onBack }: Props) {
  const [title, setTitle]         = useState(quiz?.title ?? '')
  const [questions, setQuestions] = useState(
    quiz?.questions.map(q => ({ ...q })) ?? [emptyQuestion()]
  )
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const updateQuestion = (questionIndex: number, field: string, value: unknown) =>
    setQuestions(prev => prev.map((question, index) =>
      index === questionIndex ? { ...question, [field]: value } : question
    ))

  const updateOption = (questionIndex: number, optionIndex: number, value: string) =>
    setQuestions(prev => prev.map((question, index) =>
      index === questionIndex
        ? { ...question, opcoes: question.opcoes.map((option, oi) => oi === optionIndex ? value : option) }
        : question
    ))

  const addQuestion    = () => setQuestions(prev => [...prev, emptyQuestion()])
  const removeQuestion = (questionIndex: number) =>
    setQuestions(prev => prev.filter((_, index) => index !== questionIndex))

  const handleSave = async () => {
    if (!title.trim()) { setError('Dê um título ao quiz'); return }
    for (const [index, question] of questions.entries()) {
      if (!question.pergunta.trim()) { setError(`Pergunta ${index + 1} está vazia`); return }
      if (question.opcoes.some(option => !option.trim())) {
        setError(`Preencha todas as opções da pergunta ${index + 1}`)
        return
      }
    }
    setError('')
    setLoading(true)
    try {
      await onSave(title, questions.map((question, index) => ({ ...question, order: index })))
    } catch {
      setError('Erro ao salvar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold bg-linear-to-br from-primary to-secondary bg-clip-text text-transparent">
            {quiz ? 'Editar Quiz' : 'Novo Quiz'}
          </h1>
        </div>
        <button onClick={onBack} className="text-xs text-muted hover:text-white transition-colors">
          ← Voltar
        </button>
      </div>

      <input
        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-white text-base
          font-semibold outline-none focus:border-primary transition-colors mb-6"
        placeholder="Título do quiz (ex: Revisão Cap. 3)"
        value={title}
        onChange={event => setTitle(event.target.value)}
      />

      <div className="flex flex-col gap-6">
        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="bg-surface border border-border rounded-xl p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-muted">Pergunta {questionIndex + 1}</span>
              <div className="flex items-center gap-3">
                <select
                  value={question.nivel}
                  onChange={event => updateQuestion(questionIndex, 'nivel', event.target.value)}
                  className="bg-surface2 border border-border rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                >
                  <option value="facil">Fácil</option>
                  <option value="medio">Médio</option>
                  <option value="dificil">Difícil</option>
                </select>
                {questions.length > 1 && (
                  <button
                    onClick={() => removeQuestion(questionIndex)}
                    className="text-danger text-xs hover:opacity-70 transition-opacity"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>

            <textarea
              rows={2}
              className="w-full px-4 py-3 bg-surface2 border border-border rounded-lg text-sm text-white
                outline-none focus:border-primary transition-colors resize-none mb-4"
              placeholder="Digite a pergunta..."
              value={question.pergunta}
              onChange={event => updateQuestion(questionIndex, 'pergunta', event.target.value)}
            />

            <div className="grid grid-cols-2 gap-2 mb-4">
              {question.opcoes.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${questionIndex}`}
                    checked={question.resposta === optionIndex}
                    onChange={() => updateQuestion(questionIndex, 'resposta', optionIndex)}
                    className="accent-primary"
                  />
                  <input
                    className="flex-1 px-3 py-2 bg-surface2 border border-border rounded-lg text-sm text-white
                      outline-none focus:border-primary transition-colors"
                    placeholder={`Opção ${String.fromCharCode(65 + optionIndex)}`}
                    value={option}
                    onChange={event => updateOption(questionIndex, optionIndex, event.target.value)}
                  />
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted">Selecione o radio ao lado da opção correta</p>

            <input
              className="mt-3 w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-xs text-white
                outline-none focus:border-primary transition-colors"
              placeholder="Explicação (opcional)"
              value={question.explicacao}
              onChange={event => updateQuestion(questionIndex, 'explicacao', event.target.value)}
            />
          </div>
        ))}

        <button
          onClick={addQuestion}
          className="w-full py-3 border border-dashed border-border rounded-xl text-sm text-muted
            hover:border-primary hover:text-white transition-all"
        >
          + Adicionar pergunta
        </button>

        {error && <p className="text-danger text-sm text-center">{error}</p>}

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-4 bg-linear-to-r from-primary to-violet-400 text-white font-bold text-base
            rounded-xl hover:opacity-85 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? 'Salvando...' : `Salvar quiz com ${questions.length} pergunta${questions.length > 1 ? 's' : ''}`}
        </button>
      </div>
    </div>
  )
}
