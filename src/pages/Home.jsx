import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Button from '../components/Button'
import Card from '../components/Card'
import LoadingState from '../components/LoadingState'
import { publicService } from '../services/api'
import { formatCurrency } from '../utils/format'

function Home() {
  const { data: sizes = [], isLoading, isError } = useQuery({
    queryKey: ['locker-sizes'],
    queryFn: publicService.getLockerSizes,
  })

  return (
    <AppLayout>
      <section className="grid items-center gap-8 py-4 sm:py-8 lg:grid-cols-[1.08fr_0.92fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Penyewaan loker harian</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
            Lokerku
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Simpan barang di lokasi fisik yang jelas, pilih ukuran sesuai kebutuhan, bayar berdasarkan durasi, lalu gunakan QR akses setelah transaksi berhasil.
          </p>
          <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
            <Link to="/cari-loker?region=Jakarta">
              <Button className="w-full px-5 sm:w-auto">Cari Loker</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" className="w-full px-5 sm:w-auto">Login</Button>
            </Link>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <div className="rounded-xl bg-slate-950 p-5 text-white">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-teal-200">Akses QR aktif</p>
              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200">Online</span>
            </div>
            {isLoading ? (
              <div className="mt-8"><LoadingState /></div>
            ) : isError ? (
              <p className="mt-8 text-sm text-red-200">Backend belum terhubung. Jalankan be-lokerku terlebih dahulu.</p>
            ) : (
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {sizes.map((size) => (
                  <div key={size.id} className="rounded-lg bg-white/10 p-3">
                    <p className="font-bold">{size.name}</p>
                    <p className="mt-1 text-xs text-slate-300">{formatCurrency(size.pricePerDay)}/hari</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Card className="p-4 border border-slate-100 hover:border-teal-200 transition shadow-sm bg-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-sm font-black text-teal-700">1</span>
              <p className="mt-3 font-bold text-slate-950">Cari Loker</p>
              <p className="mt-1 text-xs text-slate-500">Temukan stasiun loker fisik terdekat dari tempat Anda berada.</p>
            </Card>
            <Card className="p-4 border border-slate-100 hover:border-teal-200 transition shadow-sm bg-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-sm font-black text-teal-700">2</span>
              <p className="mt-3 font-bold text-slate-950">Isi Form & Sewa</p>
              <p className="mt-1 text-xs text-slate-500">Pilih ukuran loker sesuai barang Anda dan tentukan durasi sewa.</p>
            </Card>
            <Card className="p-4 border border-slate-100 hover:border-teal-200 transition shadow-sm bg-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-sm font-black text-teal-700">3</span>
              <p className="mt-3 font-bold text-slate-950">Scan QR Akses</p>
              <p className="mt-1 text-xs text-slate-500">Dapatkan kode QR instan untuk membuka pintu loker Anda secara mandiri.</p>
            </Card>
          </div>
        </div>
      </section>
    </AppLayout>
  )
}

export default Home
