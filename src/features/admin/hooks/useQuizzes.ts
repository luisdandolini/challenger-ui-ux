import { useState, useEffect, useCallback } from 'react'
import { quizService } from '../../../lib/services/quizService'
import type { Quiz, RoomQuestion } from '../../../lib/types'

export function useQuizzes(adminId: string | null) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(false)

  const fetchQuizzes = useCallback(async () => {
    if (!adminId) return
    setLoading(true)
    const data = await quizService.listByAdmin(adminId)
    setQuizzes(data)
    setLoading(false)
  }, [adminId])

  useEffect(() => { fetchQuizzes() }, [fetchQuizzes])

  const createQuiz = async (title: string, questions: Omit<RoomQuestion, 'id'>[]) => {
    if (!adminId) return
    const quiz = await quizService.create(adminId, title, questions)
    setQuizzes(prev => [quiz, ...prev])
  }

  const updateQuiz = async (quizId: string, title: string, questions: Omit<RoomQuestion, 'id'>[]) => {
    await quizService.update(quizId, title, questions)
    setQuizzes(prev => prev.map(quiz => quiz.id === quizId ? { ...quiz, title, questions } : quiz))
  }

  const removeQuiz = async (quizId: string) => {
    await quizService.remove(quizId)
    setQuizzes(prev => prev.filter(quiz => quiz.id !== quizId))
  }

  return { quizzes, loading, createQuiz, updateQuiz, removeQuiz }
}
