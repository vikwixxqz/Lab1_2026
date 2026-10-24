import { useState } from 'react'
import type { FormEvent } from 'react'
import type { AssignmentDraft } from '../types/assignment'

type AssignmentFormProps = {
  initialValues: AssignmentDraft
  onSave: (draft: AssignmentDraft) => void
  onCancel: () => void
}

export function AssignmentForm(props: AssignmentFormProps) {
  const [draft, setDraft] = useState(() => ({ ...props.initialValues }))
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = draft.title.trim()
    const course = draft.course.trim()
    const description = draft.description.trim()

    if (title.length < 3 || title.length > 100) {
      setError('Название должно содержать от 3 до 100 символов.')
      return
    }
    if (!draft.dueDate) {
      setError('Укажите срок сдачи.')
      return
    }
    if (course.length < 2) {
      setError('Укажите курс (не короче 2 символов).')
      return
    }
    // Предметное правило: выполненное задание — с непустым описанием
    if (draft.status === 'done' && description.length === 0) {
      setError('Для статуса «Готово» нужно заполнить описание результата.')
      return
    }

    setError('')
    props.onSave({ ...draft, title, course, description })
  }

  return (
    <form className="entity-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="assignment-title">Название</label>
      <input
        id="assignment-title"
        value={draft.title}
        required
        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
      />

      <label htmlFor="assignment-description">Описание</label>
      <textarea
        id="assignment-description"
        rows={4}
        value={draft.description}
        onChange={(e) => setDraft({ ...draft, description: e.target.value })}
      />

      <label htmlFor="assignment-course">Курс</label>
      <input
        id="assignment-course"
        value={draft.course}
        required
        onChange={(e) => setDraft({ ...draft, course: e.target.value })}
      />

      <label htmlFor="assignment-date">Срок</label>
      <input
        id="assignment-date"
        type="date"
        value={draft.dueDate}
        required
        onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
      />

      <label htmlFor="assignment-status">Статус</label>
      <select
        id="assignment-status"
        value={draft.status}
        onChange={(e) => {
          const status = e.target.value
          if (status === 'todo' || status === 'in_progress' || status === 'done') {
            setDraft({ ...draft, status })
          }
        }}
      >
        <option value="todo">К выполнению</option>
        <option value="in_progress">В работе</option>
        <option value="done">Готово</option>
      </select>

      <label htmlFor="assignment-priority">Приоритет</label>
      <select
        id="assignment-priority"
        value={draft.priority}
        onChange={(e) => {
          const priority = e.target.value
          if (priority === 'low' || priority === 'medium' || priority === 'high') {
            setDraft({ ...draft, priority })
          }
        }}
      >
        <option value="low">Низкий</option>
        <option value="medium">Средний</option>
        <option value="high">Высокий</option>
      </select>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="form-actions">
        <button type="submit" className="btn">
          Сохранить
        </button>
        <button type="button" className="btn btn-ghost" onClick={props.onCancel}>
          Отмена
        </button>
      </div>
    </form>
  )
}