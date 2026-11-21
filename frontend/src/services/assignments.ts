// ===== ЛР 6: сервис личных заданий в Supabase =====
// Доступ к строкам ограничивает RLS (owner_id = auth.uid())

import { supabase } from '../lib/supabase'
import type { Assignment, AssignmentDraft } from '../types/assignment'

// --- ЛР 6: строка БД и преобразование данных (шаг 7) ---
// Строка таблицы public.assignments (имена столбцов PostgreSQL)
type AssignmentRow = {
  id: string
  owner_id: string
  course_id: string
  title: string
  description: string
  status: Assignment['status']
  due_date: string
  priority: Assignment['priority']
  created_at: string
}

const assignmentColumns =
  'id, owner_id, course_id, title, description, status, due_date, priority, created_at'

function fromRow(row: AssignmentRow): Assignment {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    dueDate: row.due_date,
    priority: row.priority,
    course: row.course_id,
  }
}

// owner_id, id и created_at задаёт база (owner_id = auth.uid())
function toWrite(draft: AssignmentDraft) {
  return {
    course_id: draft.course,
    title: draft.title.trim(),
    description: draft.description.trim(),
    status: draft.status,
    due_date: draft.dueDate,
    priority: draft.priority,
  }
}

// --- ЛР 6: чтение и создание (шаг 8) ---
export async function getAssignments(): Promise<Assignment[]> {
  const { data, error } = await supabase
    .from('assignments')
    .select(assignmentColumns)
    .order('created_at', { ascending: false })
    .overrideTypes<AssignmentRow[], { merge: false }>()

  if (error) throw new Error(`Не удалось загрузить задания: ${error.message}`)
  return data.map(fromRow)
}

export async function createAssignment(draft: AssignmentDraft): Promise<Assignment> {
  const { data, error } = await supabase
    .from('assignments')
    .insert(toWrite(draft))
    .select(assignmentColumns)
    .single()
    .overrideTypes<AssignmentRow, { merge: false }>()

  if (error) throw new Error(`Не удалось создать задание: ${error.message}`)
  return fromRow(data)
}

// --- ЛР 6: изменение и удаление (шаг 9) ---
export async function updateAssignment(
  id: string, draft: AssignmentDraft,
): Promise<void> {
  const { error } = await supabase
    .from('assignments')
    .update(toWrite(draft))
    .eq('id', id)
  if (error) throw new Error(`Не удалось изменить задание: ${error.message}`)
}

export async function deleteAssignment(id: string): Promise<void> {
  const { error } = await supabase.from('assignments').delete().eq('id', id)
  if (error) throw new Error(`Не удалось удалить задание: ${error.message}`)
}
