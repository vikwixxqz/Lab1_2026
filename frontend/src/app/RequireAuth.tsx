// ===== ЛР 6: защищённый маршрут (шаг 6) =====
// Улучшает интерфейс; настоящую защиту данных выполняет RLS в базе

import { Navigate, Outlet, useLocation } from 'react-router'
import type { AuthState } from '../hooks/useAuth'

export function RequireAuth({ auth }: { auth: AuthState }) {
  const location = useLocation()
  if (auth.status === 'checking') {
    return <p role="status">Проверяем сессию…</p>
  }
  if (auth.status === 'guest') {
    return <Navigate to="/auth" replace
      state={{ from: location.pathname }} />
  }
  return <Outlet />
}
