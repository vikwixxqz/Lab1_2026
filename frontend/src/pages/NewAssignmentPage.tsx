import { Link } from 'react-router'

export function NewAssignmentPage() {
  return (
    <section>
      <h1>Создание задания</h1>
      <p className="placeholder">
        Форма добавления задания появится в следующей лабораторной работе.
        Сейчас это заглушка без сохранения данных.
      </p>
      <Link to="/assignments" className="btn">
        К списку заданий
      </Link>
    </section>
  )
}