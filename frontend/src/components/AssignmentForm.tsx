import { useState } from 'react'
import type { FormEvent } from 'react'
import type { AssignmentDraft } from '../types/assignment'
import { useCourses } from '../hooks/useCourses'

type AssignmentFormProps = {
  initialValues: AssignmentDraft
  onSave: (draft: AssignmentDraft) => void
  onCancel: () => void
}

export function AssignmentForm(props: AssignmentFormProps) {
  // --- ЛР 3: черновик ---
  const [draft, setDraft] = useState(() => ({ ...props.initialValues }))
  const [error, setError] = useState('')

  // --- ЛР 4: справочник (как useTags в методичке) ---
    const { load, retry } = useCourses()
  const courses = load.status === 'success' ? load.data : []
  const selectedCourseExists = courses.some((c) => c.id === draft.course)

  const canSave =
    load.status === 'success' &&
    courses.length > 0 &&
    selectedCourseExists

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // --- ЛР 4: методичка, шаг 9 ---
    if (!canSave) {
      setError('Дождитесь справочника и выберите доступный курс.')
      return
    }

    // --- ЛР 3: проверки ---
    const title = draft.title.trim()
    const description = draft.description.trim()

    if (title.length < 3 || title.length > 100) {
      setError('Название должно содержать от 3 до 100 символов.')
      return
    }
    if (!draft.dueDate) {
      setError('Укажите срок сдачи.')
      return
    }
    if (draft.status === 'done' && description.length === 0) {
      setError('Для статуса «Готово» нужно заполнить описание результата.')
      return
    }

    setError('')
    props.onSave({ ...draft, title, description })
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

      {/* --- ЛР 4: select курса (как task-tag в методичке) --- */}
      <label htmlFor="assignment-course">Курс</label>
      <select
        id="assignment-course"
        value={draft.course}
        required
        disabled={load.status !== 'success' || courses.length === 0}
        onChange={(e) => setDraft({ ...draft, course: e.target.value })}
      >
        <option value="">Выберите курс</option>
        {draft.course !== '' && !selectedCourseExists && (
          <option value={draft.course} disabled>
            Текущий код: {draft.course} — выберите доступный курс
          </option>
        )}
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.name}
          </option>
        ))}
      </select>

      {/* --- ЛР 4: состояния загрузки (шаг 8) --- */}
      {load.status === 'loading' && <p role="status">Загружаем курсы…</p>}

      {load.status === 'error' && (
        <div>
          <p role="alert">{load.message}</p>
          <button type="button" onClick={retry}>
            Повторить
          </button>
        </div>
      )}

      {load.status === 'success' && courses.length === 0 && (
        <div>
          <p role="status">Курсов пока нет. Сохранение недоступно.</p>
          <button type="button" onClick={retry}>
            Повторить
          </button>
        </div>
      )}

      {load.status === 'success' &&
        courses.length > 0 &&
        draft.course !== '' &&
        !selectedCourseExists && (
          <p role="status">Выберите курс из загруженного справочника.</p>
        )}

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="form-actions">
        {/* disabled={!canSave} — как в методичке */}
        <button type="submit" className="btn" disabled={!canSave}>
          Сохранить
        </button>
        <button type="button" className="btn btn-ghost" onClick={props.onCancel}>
          Отмена
        </button>
      </div>
    </form>
  )
}