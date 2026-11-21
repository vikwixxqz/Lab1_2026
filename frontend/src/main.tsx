import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'

const root = createRoot(document.getElementById('root')!)

// ЛР 5: App импортируется динамически, чтобы ошибка настройки Supabase
// (нет .env.local) была видна на странице, а не только в консоли.
import('./App.tsx')
  .then(({ default: App }) => {
    root.render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>,
    )
  })
  .catch((error: unknown) => {
    const message =
      error instanceof Error ? error.message : 'Ошибка запуска приложения.'
    root.render(
      <main style={{ padding: '2rem' }}>
        <h1>Ошибка настройки</h1>
        <p role="alert">{message}</p>
        <p>Создайте frontend/.env.local по образцу .env.example и перезапустите Vite.</p>
      </main>,
    )
  })
