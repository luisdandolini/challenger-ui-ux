import {
  collection, doc, setDoc, updateDoc, deleteDoc,
  getDocs, query, where, orderBy,
} from 'firebase/firestore'
import { db } from '../firebase'
import type { Quiz, RoomQuestion } from '../types'

export const quizService = {
  async create(adminId: string, title: string, questions: Omit<RoomQuestion, 'id'>[]): Promise<Quiz> {
    const quizId   = doc(collection(db, 'quizzes')).id
    const quizData: Omit<Quiz, 'id'> = { title, adminId, createdAt: Date.now(), questions }
    await setDoc(doc(db, 'quizzes', quizId), quizData)
    return { id: quizId, ...quizData }
  },

  async update(quizId: string, title: string, questions: Omit<RoomQuestion, 'id'>[]): Promise<void> {
    await updateDoc(doc(db, 'quizzes', quizId), { title, questions })
  },

  async remove(quizId: string): Promise<void> {
    await deleteDoc(doc(db, 'quizzes', quizId))
  },

  async listByAdmin(adminId: string): Promise<Quiz[]> {
    const snap = await getDocs(
      query(collection(db, 'quizzes'), where('adminId', '==', adminId), orderBy('createdAt', 'desc'))
    )
    return snap.docs.map(document => ({ id: document.id, ...document.data() } as Quiz))
  },
}
