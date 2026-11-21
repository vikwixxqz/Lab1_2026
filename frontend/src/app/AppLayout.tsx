import { useState } from 'react'
import { NavLink, Outlet } from 'react-router'
import { supabase } from '../lib/supabase'
import type { AuthState } from '../hooks/useAuth'

export function AppLayout({ auth }: { auth: AuthState }) {
  const [signingOut, setSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState('')

  async function handleSignOut() {
    setSigningOut(true)
    setSignOutError('')
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      if (error) throw error
    } catch (error: unknown) {
      setSignOutError(error instanceof Error ? error.message : 'Не удалось выйти.')
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <p className="app-title">Учебный менеджер</p>
        <nav aria-label="Основная навигация">
          <NavLink to="/" end>
            Главная
          </NavLink>
          <NavLink to="/assignments" end>
            Задания
          </NavLink>
          <NavLink to="/assignments/new">Создать</NavLink>
          {auth.status === 'guest' && <NavLink to="/auth">Вход</NavLink>}
        </nav>
        {auth.status === 'authenticated' && (
          <div className="user-bar">
            <span className="user-email">{auth.session.user.email}</span>
            <button type="button" className="btn btn-ghost btn-small"
              onClick={handleSignOut} disabled={signingOut}>
              {signingOut ? 'Выходим…' : 'Выйти'}
            </button>
          </div>
        )}
      </header>

      {signOutError && <p className="form-error" role="alert">{signOutError}</p>}

      <p className="storage-note" role="note">
        Задания хранятся в Supabase и видны только владельцу аккаунта.
        Справочник курсов общий и доступен только для чтения.
      </p>

      <main>
        <Outlet />
      </main>
    </div>
  )
}
