// ЛР 4: сервис справочника курсов
// ЛР 5: источник заменён с JSON на Supabase
import { supabase } from '../lib/supabase'
import type { Course } from '../types/course'

// --- ЛР 4: проверка структуры справочника ---
function isCourse(value: unknown): value is Course {
  if (typeof value !== 'object' || value === null) return false
  return (
    'id' in value &&
    typeof value.id === 'string' &&
    value.id.trim().length > 0 &&
    value.id === value.id.trim() &&
    'name' in value &&
    typeof value.name === 'string' &&
    value.name.trim().length > 0
  )
}

export function parseCourses(value: unknown): Course[] {
  if (!Array.isArray(value) || !value.every(isCourse)) {
    throw new Error('Неверная структура справочника курсов.')
  }
  const courses: Course[] = value
  const ids = new Set(courses.map((c) => c.id))
  if (ids.size !== courses.length) {
    throw new Error('В справочнике повторяются идентификаторы.')
  }
  return courses
}

// --- ЛР 5: справочник читается из таблицы courses в Supabase (шаг 9) ---
export async function getCourses(signal: AbortSignal): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('id, name')
    .order('name')
    .abortSignal(signal)

  if (signal.aborted) {
    throw new DOMException('Запрос отменён', 'AbortError')
  }
  if (error) {
    throw new Error(`Не удалось загрузить курсы: ${error.message}`)
  }
  return parseCourses(data)
}
