import type { AssignmentsLoad } from '../types/assignment'

type ListStatusProps = {
  load: AssignmentsLoad
  onRetry: () => void
}

// --- ЛР 6: общее отображение загрузки и ошибки личного списка
export function ListStatus({ load, onRetry }: ListStatusProps) {
  if (load.status === 'idle' || load.status === 'loading') {
    return <p className="placeholder" role="status">Загружаем задания…</p>
  }
  if (load.status === 'error') {
    return (
      <div className="list-error">
        <p className="form-error" role="alert">{load.message}</p>
        <button type="button" className="btn btn-ghost" onClick={onRetry}>
          Повторить
        </button>
      </div>
    )
  }
  return null
}
