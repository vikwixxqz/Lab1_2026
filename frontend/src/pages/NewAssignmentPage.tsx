import { useNavigate } from 'react-router'
import { AssignmentForm } from '../components/AssignmentForm'
import type { AssignmentDraft } from '../types/assignment'

type NewAssignmentPageProps = {
  onCreate: (draft: AssignmentDraft) => Promise<string>
}

const emptyAssignment: AssignmentDraft = {
  title: '',
  description: '',
  status: 'todo',
  dueDate: '',
  priority: 'medium',
  course: '',
}

export function NewAssignmentPage({ onCreate }: NewAssignmentPageProps) {
  const navigate = useNavigate()

  // --- ЛР 6: создание в Supabase, затем переход к карточке ---
  async function handleSave(draft: AssignmentDraft) {
    const id = await onCreate(draft)
    navigate(`/assignments/${id}`)
  }

  return (
    <section>
      <h1>Создание задания</h1>
      <AssignmentForm
        initialValues={emptyAssignment}
        onSave={handleSave}
        onCancel={() => navigate('/assignments')}
      />
    </section>
  )
}