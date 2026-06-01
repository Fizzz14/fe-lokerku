// Halaman utama (Dashboard) untuk pelanggan umum. Membantu user melihat data ringkasan sewa loker aktif, riwayat total sewa, total dana yang dibelanjakan, serta tombol instan untuk membuka QR kartu akses aktif.
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Button from '../components/Button'
import Card from '../components/Card'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import { lockerService } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { formatCurrency, formatDate } from '../utils/format'

function UserDashboard() {
  // Ambil data profil user yang sedang login dari hook useAuth
  const { user } = useAuth()
  
  // Tarik riwayat semua transaksi sewa loker milik user ini dari backend
  const { data = [], isLoading } = useQuery({
    queryKey: ['my-transactions'],
    queryFn: lockerService.getMyTransactions,
  })

  // Saring transaksi yang statusnya masih Aktif dan kartu fisiknya juga aktif (bisa discan)
  const activeTransactions = data.filter((transaction) => transaction.status === 'Aktif' && transaction.cardStatus === 'active')
  
  // Ambil transaksi aktif paling terbaru untuk ditampilkan sebagai QR utama di halaman dashboard
  const latestActiveTransaction = activeTransactions[0]
  
  // Jumlahkan seluruh dana yang pernah dibayarkan user untuk menyewa loker
  const totalSpent = data.reduce((sum, transaction) => sum + transaction.total, 0)

  return (
    <AppLayout>
      <PageHeader
        eyebrow="Dashboard user"
        title={`Halo, ${user?.name || 'Pengguna Lokerku'}`}
        description="Kelola sewa loker, buka QR akses aktif, dan lanjut cari lokasi loker dari satu dashboard."
        action={
          <div className="grid gap-2 sm:flex">
            <Link to="/profile">
              <Button variant="secondary" className="w-full sm:w-auto">Edit profile</Button>
            </Link>
            <Link to="/cari-loker?region=Jakarta">
              <Button className="w-full sm:w-auto">Cari loker</Button>
            </Link>
          </div>
        }
      />

      {isLoading ? <LoadingState /> : null}

      {!isLoading ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="Transaksi aktif" value={activeTransactions.length} detail="QR bisa dibuka dari kartu aktif" />
            <StatCard label="Total transaksi" value={data.length} detail="Riwayat penyewaan loker" />
            <StatCard label="Total pembayaran" value={formatCurrency(totalSpent)} detail="Akumulasi semua transaksi" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
            <Card>
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-950">Kartu akses aktif</h2>
                  <p className="mt-2 text-sm text-slate-500">QR hanya ditampilkan setelah transaksi berhasil dan status kartu aktif dari backend.</p>
                </div>
                <Link to="/riwayat">
                  <Button variant="secondary">Lihat riwayat</Button>
                </Link>
              </div>

              {latestActiveTransaction ? (
                <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-emerald-700">{latestActiveTransaction.id}</p>
                      <h3 className="mt-1 text-lg font-black text-slate-950">{latestActiveTransaction.locationName}</h3>
                      <p className="mt-2 text-sm text-slate-600">
                        Loker {latestActiveTransaction.lockerNumber} - {latestActiveTransaction.size}, {latestActiveTransaction.duration} hari
                      </p>
                      <p className="mt-1 text-sm text-slate-500">Mulai {formatDate(latestActiveTransaction.date)}</p>
                    </div>
                    <Link to={`/kartu/${latestActiveTransaction.id}`}>
                      <Button>Buka QR</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
                  <h3 className="font-bold text-slate-950">Belum ada kartu aktif</h3>
                  <p className="mt-2 text-sm text-slate-500">Mulai sewa loker untuk mendapatkan QR akses.</p>
                  <Link to="/cari-loker?region=Jakarta">
                    <Button className="mt-4">Mulai sewa</Button>
                  </Link>
                </div>
              )}
            </Card>

            <Card>
              <h2 className="text-xl font-black text-slate-950">Aksi cepat</h2>
              <div className="mt-5 space-y-3">
                <Link className="block rounded-xl border border-slate-200 p-4 transition hover:border-teal-300 hover:bg-teal-50" to="/cari-loker?region=Jakarta">
                  <p className="font-bold text-slate-950">Cari lokasi loker</p>
                  <p className="mt-1 text-sm text-slate-500">Default Jakarta, bisa filter kota lain.</p>
                </Link>
                <Link className="block rounded-xl border border-slate-200 p-4 transition hover:border-teal-300 hover:bg-teal-50" to="/riwayat">
                  <p className="font-bold text-slate-950">Riwayat transaksi</p>
                  <p className="mt-1 text-sm text-slate-500">Pantau status aktif atau selesai.</p>
                </Link>
                <Link className="block rounded-xl border border-slate-200 p-4 transition hover:border-teal-300 hover:bg-teal-50" to="/profile">
                  <p className="font-bold text-slate-950">Edit profile</p>
                  <p className="mt-1 text-sm text-slate-500">Ubah nama, email, nomor HP, dan alamat.</p>
                </Link>
                {latestActiveTransaction ? (
                  <Link className="block rounded-xl border border-slate-200 p-4 transition hover:border-teal-300 hover:bg-teal-50" to={`/kartu/${latestActiveTransaction.id}`}>
                    <p className="font-bold text-slate-950">QR akses terbaru</p>
                    <p className="mt-1 text-sm text-slate-500">Tampilkan QR untuk scan akses.</p>
                  </Link>
                ) : null}
              </div>
            </Card>
          </div>
        </>
      ) : null}
    </AppLayout>
  )
}

export default UserDashboard
