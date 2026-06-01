import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Button from '../components/Button'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import { useAuth } from '../hooks/useAuth'
import { getImageUrl, userService } from '../services/api'

function EditProfile() {
  // Ambil data user login & fungsi update dari context autentikasi global
  const { user, updateProfile, updateUserState } = useAuth()
  
  // State form lokal buat nyimpen ketikan user
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    password: '', // State password baru (opsional)
    confirmPassword: '', // State konfirmasi password baru
  })
  
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // Fungsi buat ngubah nilai state tiap kali user ngetik di input field
  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  // Fungsi pas user menekan tombol "Simpan profile"
  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    // Validasi basic: Nama & email gak boleh kosong!
    if (!form.name.trim() || !form.email.trim()) {
      setError('Nama dan email wajib diisi.')
      return
    }

    // Validasi format email standard
    if (!form.email.includes('@')) {
      setError('Format email belum valid.')
      return
    }

    // Validasi ganti password baru (jika diisi)
    if (form.password) {
      if (form.password.length < 6) {
        setError('Password baru minimal harus 6 karakter.')
        return
      }
      if (form.password !== form.confirmPassword) {
        setError('Konfirmasi password baru tidak cocok.')
        return
      }
    }

    setLoading(true)
    try {
      // Siapkan payload data untuk dikirim ke API backend
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      }
      
      // Sematkan password baru ke payload hanya jika diisi
      if (form.password) {
        payload.password = form.password
      }

      // Kirim request update profile ke backend API via context hook
      await updateProfile(payload)
      
      setSuccess('Profil dan password berhasil diperbarui.')
      
      // Kosongkan kembali field password setelah sukses update
      setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }))
    } catch (err) {
      setError(err.response?.data?.message || 'Profil gagal diperbarui. Coba lagi nanti.')
    } finally {
      setLoading(false)
    }
  }

  // Fungsi ganti foto profil user
  async function handlePhotoChange(event) {
    const file = event.target.files[0]
    if (!file) return

    setLoading(true)
    setError('')
    setSuccess('')
    try {
      // Kirim file gambar ke API upload foto backend
      const result = await userService.uploadPhoto(file)
      
      // Update data image user secara lokal di context global
      updateUserState({ image: result.image })
      setSuccess('Foto profil berhasil diperbarui.')
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengunggah foto profil.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      {/* Header Halaman */}
      <PageHeader
        eyebrow="Profil"
        title="Edit profile"
        description="Perbarui data akun yang akan dipakai untuk transaksi, riwayat, dan komunikasi akses loker."
        action={
          <Link to="/dashboard">
            <Button variant="secondary">Kembali</Button>
          </Link>
        }
      />

      {/* Grid Layout: Kiri Form Edit, Kanan Detail Kartu Foto Profil */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        
        {/* Card Form Edit Profile (Kiri) */}
        <Card>
          {/* Notifikasi Status Sukses/Error */}
          {error ? <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
          {success ? <p className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{success}</p> : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Input Nama Lengkap */}
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Nama lengkap</span>
              <input
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nama lengkap"
              />
            </label>

            {/* Input Email */}
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Email</span>
              <input
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="nama@email.com"
              />
            </label>

            {/* Input Nomor Handphone */}
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Nomor HP</span>
              <input
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
              />
            </label>

            {/* Input Alamat */}
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Alamat</span>
              <textarea
                className="mt-2 min-h-28 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Alamat domisili"
              />
            </label>

            {/* Input Password Baru & Konfirmasi Password (Sejajar) */}
            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Password Baru (Opsional)</span>
                <input
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Kosongkan jika tidak diganti"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Konfirmasi Password</span>
                <input
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ketik ulang password baru"
                />
              </label>
            </div>

            {/* Tombol Simpan */}
            <div className="pt-4">
              <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan profile'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Card Foto Profil & Status Akun (Kanan) */}
        <Card className="h-fit">
          {/* Lingkaran Avatar Foto Profil */}
          <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-2xl bg-slate-100 ring-4 ring-white shadow-lg">
            <img 
              src={getImageUrl(user?.image)} 
              alt={user?.name} 
              className="h-full w-full object-cover"
            />
            {loading && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            )}
          </div>
          
          <div className="mt-6 flex flex-col items-center">
            {/* Tombol Unggah Foto */}
            <label className="cursor-pointer">
              <span className="text-xs font-bold text-teal-600 hover:text-teal-700 transition">Ubah Foto Profil</span>
              <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} disabled={loading} />
            </label>
            
            {/* Detail Ringkas Info Akun */}
            <h2 className="mt-4 text-xl font-black text-slate-950">{user?.name || 'Pengguna Lokerku'}</h2>
            <p className="mt-1 text-sm text-slate-500">{user?.email}</p>
            <span className="mt-4 inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-bold uppercase text-teal-700">
              {user?.role}
            </span>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}

export default EditProfile
