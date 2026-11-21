import { useState } from 'react'
import { Link } from 'react-router'
import { AssignmentCard } from '../components/AssignmentCard'
import { ListStatus } from '../components/ListStatus'
import type {
  Assignment,
  AssignmentStatus,
  AssignmentsLoad,
} from '../types/assignment'

type AssignmentsPageProps = {
  assignments: Assignment[]
  load: AssignmentsLoad
  onRetry: () => void
}

export function AssignmentsPage({ assignments, load, onRetry }: AssignmentsPageProps) {
  const [status, setStatus] = useState<AssignmentStatus | 'all'>('all')

  const visible = assignments.filter(
    (item) => status === 'all' || item.status === status,
  )

  return (
    <section>
      <div className="page-header">
        <h1>Мои задания</h1>
        <Link to="/assignments/new" className="btn">
          Добавить задание
        </Link>
      </div>

      <div className="filter-bar">
        <label htmlFor="filter-status">Статус</label>
        <select
          id="filter-status"
          value={status}
          onChange={(e) => {
            const value = e.target.value
            if (
              value === 'all' ||
              value === 'todo' ||
              value === 'in_progress' ||
              value === 'done'
            ) {
              setStatus(value)
            }
          }}
        >
          <option value="all">Все</option>
          <option value="todo">К выполнению</option>
          <option value="in_progress">В работе</option>
          <option value="done">Готово</option>
        </select>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setStatus('all')}
        >
          Сбросить фильтр
        </button>
      </div>

      {/* --- ЛР 6: загрузка и ошибка личного списка --- */}
      {load.status !== 'success' ? (
        <ListStatus load={load} onRetry={onRetry} />
      ) : assignments.length === 0 ? (
        <p className="placeholder">Заданий пока нет. Создайте первое.</p>
      ) : visible.length === 0 ? (
        <p className="placeholder">Нет заданий с выбранным статусом.</p>
      ) : (
        <div className="task-list">
          {visible.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      )}
    </section>
  )
}