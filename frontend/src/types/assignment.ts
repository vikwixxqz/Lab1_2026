export type AssignmentStatus = 'todo' | 'in_progress' | 'done'

export type Assignment = {
  id: string
  title: string
  description: string
  status: AssignmentStatus
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  course: string // id из справочника курсов (в БД — course_id)
}

export type AssignmentDraft = Omit<Assignment, 'id'>

// ЛР 6: состояние загрузки личного списка из Supabase
export type AssignmentsLoad =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success' }
