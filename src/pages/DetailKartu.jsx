import { useQuery } from '@tanstack/react-query'
import { QRCodeCanvas } from 'qrcode.react'
import { Link, useParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Card from '../components/Card'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import { lockerService } from '../services/api'
import { useBookingStore } from '../store/bookingStore'
import { formatCurrency, formatDate } from '../utils/format'

function DetailKartu() {
  // Ambil ID transaksi dari URL halaman (misal: /kartu/TRX-001)
  const { transactionId } = useParams()
  
  // Ambil data transaksi sewa terakhir dari store local (kalau baru aja checkout)
  const lastBooking = useBookingStore((state) => state.lastBooking)

  // Ambil detail kartu akses QR dari database API berdasarkan ID Transaksi
  const { data, isLoading, isError } = useQuery({
    queryKey: ['access-card', transactionId],
    queryFn: () => lockerService.getAccessCard(transactionId),
    // Kalau baru checkout, pake data transaksi terakhir sebagai data awal biar instan
    initialData: lastBooking?.id === transactionId ? { ...lastBooking, cardStatus: 'active' } : undefined,
  })

  // Tampilkan loading screen kalau data kartu masih dimuat dari API
  if (isLoading) return <AppLayout><LoadingState /></AppLayout>
  
  // Tampilkan error screen kalau data kartu gagal didapat
  if (isError || !data) return <AppLayout><EmptyState title="Kartu tidak ditemukan" description="Detail kartu akses belum tersedia." /></AppLayout>

  // Cek apakah status kartu akses aktif atau tidak
  const isActive = data.cardStatus === 'active'
  
  // Bikin isi data QR Code (payload JSON) biar bisa dipindai pake aplikasi scanner
  const qrValue = JSON.stringify({
    app: 'Lokerku',
    transactionId: data.id,
    accessCode: data.accessCode,
    status: isActive ? 'active' : 'inactive',
  })

  return (
    <AppLayout>
      {/* Header Halaman */}
      <PageHeader eyebrow="Kartu akses" title="QR User" description="QR ini real dan bisa dipindai. Status aktif mengikuti data kartu dari backend." />
      
      {/* Grid Layout: Kiri QR Code, Kanan Rincian Transaksi */}
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        
        {/* Card Bagian QR Code (Kiri) */}
        <Card className="text-center">
          {/* Wadah gambar QR Code agar estetis */}
          <div className="mx-auto w-fit rounded-2xl bg-white p-5 shadow-inner ring-1 ring-slate-200">
            <QRCodeCanvas value={qrValue} size={260} level="H"/>
          </div>
          
          {/* Status Aktif/Tidak Aktif */}
          <p className={`mx-auto mt-5 w-fit rounded-full px-4 py-2 text-sm font-black ${isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {isActive ? 'QR aktif' : 'QR tidak aktif'}
          </p>
          
          {/* Kode Akses Unik Teks */}
          <p className="mt-3 break-all text-sm text-slate-500">{data.accessCode}</p>
        </Card>
        
        {/* detail card kanan*/}
        <Card>
          <h2 className="text-xl font-black text-slate-950">Detail transaksi</h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div><dt className="text-sm text-slate-500">ID transaksi</dt><dd className="mt-1 font-bold text-slate-950">{data.id}</dd></div>
            <div><dt className="text-sm text-slate-500">Tanggal</dt><dd className="mt-1 font-bold text-slate-950">{formatDate(data.date)}</dd></div>
            <div><dt className="text-sm text-slate-500">Lokasi</dt><dd className="mt-1 font-bold text-slate-950">{data.locationName}</dd></div>
            <div><dt className="text-sm text-slate-500">Nomor loker</dt><dd className="mt-1 font-bold text-slate-950">{data.lockerNumber}</dd></div>
            <div><dt className="text-sm text-slate-500">Ukuran</dt><dd className="mt-1 font-bold text-slate-950">{data.size}</dd></div>
            <div><dt className="text-sm text-slate-500">Durasi</dt><dd className="mt-1 font-bold text-slate-950">{data.duration} hari</dd></div>
            <div><dt className="text-sm text-slate-500">Total</dt><dd className="mt-1 font-bold text-teal-700">{formatCurrency(data.total)}</dd></div>
            <div><dt className="text-sm text-slate-500">Status</dt><dd className="mt-1 font-bold text-slate-950">{data.status}</dd></div>
          </dl>
          
          {/* nav bawah*/}
          <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button className="w-full">Kembali ke Beranda</Button>
            </Link>
            <Link to="/riwayat" className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full">Lihat Riwayat Sewa</Button>
            </Link>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}

export default DetailKartu
