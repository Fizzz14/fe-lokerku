import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Button from '../components/Button'
import Card from '../components/Card'
import { useAuth } from '../hooks/useAuth'

const roleRoutes = {
  admin: ['/admin', '/admin/laporan', '/admin/loker'],
  user: ['/user', '/cari-loker', '/riwayat', '/lokasi', '/kartu'],
}

function getLoginRedirect(user, fromPath) {
  const fallbackPath = user.role === 'admin' ? '/admin' : '/user'
  const allowedPaths = roleRoutes[user.role] || []
  const canReturnToPreviousPage = fromPath && allowedPaths.some((path) => fromPath === path || fromPath.startsWith(`${path}/`))

  return canReturnToPreviousPage ? fromPath : fallbackPath
}

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const sessionExpired = new URLSearchParams(location.search).get('reason') === 'session'
  const [form, setForm] = useState({ email: '', password: '' })
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Email dan password wajib diisi.')
      return
    }
    setLoading(true)
    try {
      const user = await login(form, remember)
      navigate(getLoginRedirect(user, location.state?.from?.pathname), { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa kembali akun Anda.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-md">
        <Card>
          <h1 className="text-2xl font-black text-slate-950">Masuk ke Lokerku</h1>
          <p className="mt-2 text-sm text-slate-500">Masuk menggunakan akun yang sudah terdaftar. Sistem akan mengarahkan dashboard sesuai role akun.</p>
          {sessionExpired ? (
            <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
              Sesi login kedaluwarsa atau token tidak valid. Login ulang sebagai admin.
            </p>
          ) : null}
          {error ? <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Email</span>
              <input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none" name="email" type="email" value={form.email} onChange={handleChange} placeholder="nama@email.com" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Password</span>
              <input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Minimal 6 karakter" />
            </label>
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={remember} 
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 accent-teal-600"
                />
                <span className="text-sm font-semibold text-slate-600">Ingat saya (Remember me)</span>
              </label>
            </div>
            <Button type="submit" className="w-full mt-2" disabled={loading}>{loading ? 'Memproses...' : 'Login'}</Button>
          </form>
          <p className="mt-5 text-center text-sm text-slate-500">
            Belum punya akun? <Link className="font-bold text-teal-700" to="/register">Daftar</Link>
          </p>
        </Card>
      </div>
    </AppLayout>
  )
}

export default Login
