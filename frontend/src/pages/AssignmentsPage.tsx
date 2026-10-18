import { Link } from 'react-router'
import { AssignmentCard } from '../components/AssignmentCard'
import { assignments } from '../data/assignments'

export function AssignmentsPage() {
  return (
    <section>
      <div className="page-header">
        <h1>Мои задания</h1>
        <Link to="/assignments/new" className="btn">
          Добавить задание
        </Link>
      </div>

      {assignments.length === 0 ? (
        <p className="placeholder">Заданий пока нет.</p>
      ) : (
        <div className="task-list">
          {assignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      )}
    </section>
  )
}