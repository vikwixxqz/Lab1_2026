import { Link, useNavigate, useParams } from 'react-router'
import { AssignmentForm } from '../components/AssignmentForm'
import { ListStatus } from '../components/ListStatus'
import type {
  Assignment,
  AssignmentDraft,
  AssignmentsLoad,
} from '../types/assignment'

type EditAssignmentPageProps = {
  assignments: Assignment[]
  load: AssignmentsLoad
  onRetry: () => void
  onUpdate: (id: string, draft: AssignmentDraft) => Promise<void>
}

export function EditAssignmentPage({
  assignments,
  load,
  onRetry,
  onUpdate,
}: EditAssignmentPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const assignment = assignments.find((item) => item.id === id)

  if (load.status !== 'success') {
    return <ListStatus load={load} onRetry={onRetry} />
  }

  if (!assignment) {
    return (
      <section className="details-empty">
        <h1>Задание не найдено</h1>
        <p className="placeholder">Записи с таким id нет в списке.</p>
        <Link to="/assignments" className="btn">
          К списку заданий
        </Link>
      </section>
    )
  }

  const initialValues: AssignmentDraft = {
    title: assignment.title,
    description: assignment.description,
    status: assignment.status,
    dueDate: assignment.dueDate,
    priority: assignment.priority,
    course: assignment.course,
  }

  return (
    <section>
      <h1>Редактирование задания</h1>
      <AssignmentForm
        key={assignment.id}
        initialValues={initialValues}
        onSave={async (draft) => {
          await onUpdate(assignment.id, draft)
          navigate(`/assignments/${assignment.id}`)
        }}
        onCancel={() => navigate(`/assignments/${assignment.id}`)}
      />
    </section>
  )
}