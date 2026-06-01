import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Button from '../components/Button'
import Card from '../components/Card'
import { useAuth } from '../hooks/useAuth'

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (!form.name || !form.email || form.password.length < 6) {
      setError('Nama, email, dan password minimal 6 karakter wajib diisi.')
      return
    }
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password, phone: form.phone })
      navigate('/cari-loker?region=Jakarta', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal. Coba lagi nanti.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-md">
        <Card>
          <h1 className="text-2xl font-black text-slate-950">Buat akun Lokerku</h1>
          <p className="mt-2 text-sm text-slate-500">Akun digunakan untuk transaksi, QR akses, dan riwayat sewa.</p>
          {error ? <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Nama</span>
              <input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none" name="name" value={form.name} onChange={handleChange} placeholder="Nama lengkap" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Email</span>
              <input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none" name="email" type="email" value={form.email} onChange={handleChange} placeholder="nama@email.com" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Password</span>
              <input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Minimal 6 karakter" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Nomor HP</span>
              <input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none" name="phone" value={form.phone} onChange={handleChange} placeholder="08xxxxxxxxxx" />
            </label>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Mendaftarkan...' : 'Daftar'}</Button>
          </form>
          <p className="mt-5 text-center text-sm text-slate-500">
            Sudah punya akun? <Link className="font-bold text-teal-700" to="/login">Login</Link>
          </p>
        </Card>
      </div>
    </AppLayout>
  )
}

export default Register
