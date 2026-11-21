import { useCallback, useEffect, useRef, useState } from 'react'
import { Route, Routes } from 'react-router'
import { AppLayout } from './app/AppLayout'
import { RequireAuth } from './app/RequireAuth'
import { useAuth } from './hooks/useAuth'
import { HomePage } from './pages/HomePage'
import { AuthPage } from './pages/AuthPage'
import { AssignmentsPage } from './pages/AssignmentsPage'
import { AssignmentDetailsPage } from './pages/AssignmentDetailsPage'
import { NewAssignmentPage } from './pages/NewAssignmentPage'
import { EditAssignmentPage } from './pages/EditAssignmentPage'
import { NotFoundPage } from './pages/NotFoundPage'
import type {
  Assignment,
  AssignmentDraft,
  AssignmentsLoad,
} from './types/assignment'
import {
  createAssignment as createAssignmentRow,
  deleteAssignment as deleteAssignmentRow,
  getAssignments,
  updateAssignment as updateAssignmentRow,
} from './services/assignments'
import './App.css'

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Не удалось загрузить задания.'
}

export default function App() {
  // --- ЛР 6: состояние авторизации (один вызов useAuth) ---
  const auth = useAuth()
  const userId = auth.status === 'authenticated' ? auth.session.user.id : null

  // --- ЛР 6: личный список из Supabase (шаги 8, 10) ---
  // До входа список пуст; демонстрационные записи ЛР 2 больше не используются
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [load, setLoad] = useState<AssignmentsLoad>({ status: 'idle' })
  const [attempt, setAttempt] = useState(0)
  const userIdRef = useRef<string | null>(userId)

  useEffect(() => {
    userIdRef.current = userId
    // Смена сессии: сначала очищаем прежний список
    setAssignments([])
    if (!userId) {
      setLoad({ status: 'idle' })
      return
    }

    let active = true
    setLoad({ status: 'loading' })
    getAssignments()
      .then((data) => {
        if (!active) return
        setAssignments(data)
        setLoad({ status: 'success' })
      })
      .catch((error: unknown) => {
        if (active) setLoad({ status: 'error', message: errorMessage(error) })
      })

    return () => {
      active = false
    }
  }, [userId, attempt])

  const retry = useCallback(() => setAttempt((current) => current + 1), [])

  // Повторная загрузка после изменения: ошибка чтения видна в списке,
  // но не выдаётся за ошибку уже выполненной операции
  async function reload(): Promise<void> {
    const owner = userIdRef.current
    try {
      const data = await getAssignments()
      if (userIdRef.current !== owner) return
      setAssignments(data)
      setLoad({ status: 'success' })
    } catch (error: unknown) {
      if (userIdRef.current === owner) {
        setLoad({ status: 'error', message: errorMessage(error) })
      }
    }
  }

  // --- ЛР 6: CRUD через Supabase с повторной загрузкой списка ---
  async function createAssignment(draft: AssignmentDraft): Promise<string> {
    const created = await createAssignmentRow(draft)
    await reload()
    return created.id
  }

  async function updateAssignment(id: string, draft: AssignmentDraft): Promise<void> {
    await updateAssignmentRow(id, draft)
    await reload()
  }

  async function deleteAssignment(id: string): Promise<void> {
    await deleteAssignmentRow(id)
    await reload()
  }

  return (
    <Routes>
      <Route element={<AppLayout auth={auth} />}>
        <Route index element={<HomePage />} />
        {/* --- ЛР 6: публичная страница входа --- */}
        <Route path="auth" element={<AuthPage auth={auth} />} />

        {/* --- ЛР 6: личные страницы только после входа --- */}
        <Route element={<RequireAuth auth={auth} />}>
          <Route
            path="assignments"
            element={
              <AssignmentsPage
                assignments={assignments}
                load={load}
                onRetry={retry}
              />
            }
          />
          <Route
            path="assignments/new"
            element={<NewAssignmentPage onCreate={createAssignment} />}
          />
          <Route
            path="assignments/:id"
            element={
              <AssignmentDetailsPage
                assignments={assignments}
                load={load}
                onRetry={retry}
                onDelete={deleteAssignment}
              />
            }
          />
          <Route
            path="assignments/:id/edit"
            element={
              <EditAssignmentPage
                assignments={assignments}
                load={load}
                onRetry={retry}
                onUpdate={updateAssignment}
              />
            }
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
