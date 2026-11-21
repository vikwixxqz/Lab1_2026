// ===== ЛР 6: страница входа и регистрации (шаг 5) =====

import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { supabase } from '../lib/supabase'
import type { AuthState } from '../hooks/useAuth'

type Mode = 'signin' | 'signup'

function getFrom(state: unknown): string {
  if (
    typeof state === 'object' && state !== null &&
    'from' in state && typeof state.from === 'string' &&
    state.from.startsWith('/') && state.from !== '/auth'
  ) {
    return state.from
  }
  return '/assignments'
}

export function AuthPage({ auth }: { auth: AuthState }) {
  const navigate = useNavigate()
  const location = useLocation()
  const from = getFrom(location.state)

  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  if (auth.status === 'authenticated') {
    return <Navigate to={from} replace />
  }

  function switchMode(next: Mode) {
    setMode(next)
    setPassword('')
    setError('')
    setMessage('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    setError('')
    setMessage('')

    if (!email.trim()) {
      setError('Укажите email.')
      return
    }
    // Правило учебного проекта: не меньше 8 символов, буквы и цифры
    if (mode === 'signup' &&
      (password.length < 8 || !/[A-Za-zА-Яа-я]/.test(password) || !/\d/.test(password))) {
      setError('Пароль: не меньше 8 символов, хотя бы одна буква и одна цифра.')
      return
    }
    if (mode === 'signin' && password.length === 0) {
      setError('Введите пароль.')
      return
    }

    // --- ЛР 6: регистрация (signUp) и вход (signInWithPassword) ---
    setPending(true)
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin },
        })
        if (error) throw error
        if (data.session) {
          navigate(from, { replace: true })
        } else {
          setPassword('')
          setMessage('Проверьте почту и подтвердите регистрацию. Затем войдите.')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        if (error) throw error
        navigate(from, { replace: true })
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Не удалось выполнить запрос.')
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="auth-page">
      <h1>{mode === 'signin' ? 'Вход' : 'Регистрация'}</h1>

      <div className="auth-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={mode === 'signin'}
          className={mode === 'signin' ? 'auth-tab active' : 'auth-tab'}
          disabled={pending} onClick={() => switchMode('signin')}>
          Вход
        </button>
        <button type="button" role="tab" aria-selected={mode === 'signup'}
          className={mode === 'signup' ? 'auth-tab active' : 'auth-tab'}
          disabled={pending} onClick={() => switchMode('signup')}>
          Регистрация
        </button>
      </div>

      <form className="entity-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="auth-email">Email</label>
        <input
          id="auth-email"
          type="email"
          autoComplete="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="auth-password">Пароль</label>
        <input
          id="auth-password"
          type="password"
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        {mode === 'signup' && (
          <p className="field-hint">Не меньше 8 символов, буквы и цифры.</p>
        )}

        {error && <p className="form-error" role="alert">{error}</p>}
        {message && <p className="form-message" role="status">{message}</p>}

        <div className="form-actions">
          <button type="submit" className="btn" disabled={pending}>
            {pending
              ? 'Отправляем…'
              : mode === 'signin' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </div>
      </form>
    </section>
  )
}
