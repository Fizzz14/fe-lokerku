import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Button from '../components/Button'
import Card from '../components/Card'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import { lockerService } from '../services/api'
import { formatCurrency, formatDate } from '../utils/format'

function Riwayat() {
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ['my-transactions'],
    queryFn: lockerService.getMyTransactions,
  })

  return (
    <AppLayout>
      <PageHeader eyebrow="Riwayat" title="Transaksi penyewaan" description="Lihat status sewa, total pembayaran, dan buka QR akses untuk transaksi aktif." />
      {isLoading ? <LoadingState /> : null}
      {isError ? <EmptyState title="Riwayat gagal dimuat" description="Pastikan backend transaksi sudah berjalan." /> : null}
      {!isLoading && !isError && data.length === 0 ? <EmptyState title="Belum ada transaksi" description="Mulai cari loker dan buat transaksi pertama Anda." /> : null}
      <div className="space-y-4">
        {data.map((transaction) => (
          <Card key={transaction.id} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-black text-slate-950">{transaction.id}</h2>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                  transaction.status === 'Aktif' && transaction.cardStatus === 'active'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {transaction.status === 'Aktif' && transaction.cardStatus === 'active' ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{transaction.locationName} - Loker {transaction.lockerNumber}</p>
              <p className="mt-1 text-sm text-slate-500">{transaction.size}, {transaction.duration} hari, {formatDate(transaction.date)}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-lg font-black text-slate-950">{formatCurrency(transaction.total)}</p>
              <Link to={`/kartu/${transaction.id}`}>
                <Button variant="secondary">QR</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </AppLayout>
  )
}

export default Riwayat
