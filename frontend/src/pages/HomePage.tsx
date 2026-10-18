import { Link } from 'react-router'

export function HomePage() {
  return (
    <section className="home">
      <div className="home-hero">
        <div className="badge">Учёба</div>
        <h1>Учебный менеджер</h1>
        <p className="subtitle">
          Задания, курсы и дедлайны в одном месте.
          Планируй учёбу и не пропускай сроки.
        </p>
        <div className="home-actions">
          <Link to="/assignments" className="btn">
            Мои задания
          </Link>
          <Link to="/assignments/new" className="btn btn-ghost">
            Добавить задание
          </Link>
        </div>
      </div>

      <div className="home-features">
        <article className="feature-card">
          <span className="feature-icon">📋</span>
          <h3>Список заданий</h3>
          <p>Все дедлайны и курсы под рукой</p>
        </article>
        <article className="feature-card">
          <span className="feature-icon">🎯</span>
          <h3>Приоритеты</h3>
          <p>Сначала важное — потом остальное</p>
        </article>
        <article className="feature-card">
          <span className="feature-icon">📅</span>
          <h3>Сроки</h3>
          <p>Не пропускай контрольные и сдачи</p>
        </article>
      </div>
    </section>
  )
}