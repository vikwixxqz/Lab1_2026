import { Link, useNavigate, useParams } from 'react-router'
import type { Assignment } from '../types/assignment'

type AssignmentDetailsPageProps = {
  assignments: Assignment[]
  onDelete: (id: string) => void
}

const statusLabel = {
  todo: 'К выполнению',
  in_progress: 'В работе',
  done: 'Готово',
} as const

const priorityLabel = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
} as const

export function AssignmentDetailsPage({
  assignments,
  onDelete,
}: AssignmentDetailsPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const assignment = assignments.find((item) => item.id === id)

  if (!assignment) {
    return (
      <section className="details-empty">
        <div className="empty-icon">🔍</div>
        <h1>Задание не найдено</h1>
        <p className="placeholder">
          Записи с таким id нет в списке. Возможно, оно было удалено.
        </p>
        <Link to="/assignments" className="btn">
          К списку заданий
        </Link>
      </section>
    )
  }

  return (
    <section className="details">
      <div className="details-hero">
        <div className="details-badges">
          <span className={`badge status-${assignment.status}`}>
            {statusLabel[assignment.status]}
          </span>
          <span className={`badge priority-${assignment.priority}`}>
            {priorityLabel[assignment.priority]}
          </span>
        </div>
        <h1>{assignment.title}</h1>
        <p className="details-course">{assignment.course}</p>
      </div>

      <div className="details-body">
        <div className="details-block">
          <h2>Описание</h2>
          <p>{assignment.description || '—'}</p>
        </div>

        <div className="details-grid">
          <div className="details-stat">
            <span className="stat-label">Срок сдачи</span>
            <span className="stat-value">{assignment.dueDate}</span>
          </div>
          <div className="details-stat">
            <span className="stat-label">Приоритет</span>
            <span className="stat-value">
              {priorityLabel[assignment.priority]}
            </span>
          </div>
          <div className="details-stat">
            <span className="stat-label">Статус</span>
            <span className="stat-value">{statusLabel[assignment.status]}</span>
          </div>
          <div className="details-stat">
            <span className="stat-label">Курс</span>
            <span className="stat-value">{assignment.course}</span>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <Link to={`/assignments/${assignment.id}/edit`} className="btn">
          Редактировать
        </Link>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => {
            if (window.confirm(`Удалить задание «${assignment.title}»?`)) {
              onDelete(assignment.id)
              navigate('/assignments', { replace: true })
            }
          }}
        >
          Удалить
        </button>
        <Link to="/assignments" className="btn btn-ghost">
          ← К списку
        </Link>
      </div>
    </section>
  )
}