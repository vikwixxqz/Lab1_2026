import { Link } from 'react-router'
import type { Assignment } from '../types/assignment'

type AssignmentCardProps = {
  assignment: Assignment
}

const statusLabel: Record<Assignment['status'], string> = {
  todo: 'К выполнению',
  in_progress: 'В работе',
  done: 'Готово',
}

const priorityLabel: Record<Assignment['priority'], string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
}

export function AssignmentCard({ assignment }: AssignmentCardProps) {
  return (
    <article className={`task-card priority-border-${assignment.priority}`}>
      <div className="card-top">
        <span className={`badge status-${assignment.status}`}>
          {statusLabel[assignment.status]}
        </span>
        <span className={`badge priority-${assignment.priority}`}>
          {priorityLabel[assignment.priority]}
        </span>
      </div>

      <h2>
        <Link to={`/assignments/${assignment.id}`}>{assignment.title}</Link>
      </h2>

      <p className="card-desc">{assignment.description}</p>

      <div className="card-footer">
        <span className="card-course">{assignment.course}</span>
        <span className="card-date">до {assignment.dueDate}</span>
      </div>
    </article>
  )
}