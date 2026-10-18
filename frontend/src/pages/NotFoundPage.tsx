import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <section className="details-empty">
      <div className="empty-icon">🚫</div>
      <h1>Страница не найдена</h1>
      <p className="placeholder">
        Такого адреса в приложении нет. Проверьте ссылку или вернитесь к списку.
      </p>
      <Link to="/assignments" className="btn">
        К списку заданий
      </Link>
    </section>
  )
}