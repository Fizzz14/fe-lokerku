import { useQuery } from '@tanstack/react-query'
import { Bar, Doughnut } from 'react-chartjs-2'
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, ArcElement, Tooltip } from 'chart.js'
import AdminLayout from '../components/AdminLayout'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import Card from '../components/Card'
import { adminService } from '../services/api'
import { formatCurrency } from '../utils/format'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

function AdminDashboard() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-summary'], queryFn: adminService.getSummary })
  const { data: reports } = useQuery({ queryKey: ['admin-reports'], queryFn: adminService.getReports })

  return (
    <AdminLayout>
      <PageHeader eyebrow="Admin" title="Dashboard operasional" description="Pantau pendapatan, okupansi, kartu aktif, dan transaksi penyewaan loker." />
      {isLoading ? <LoadingState /> : null}
      {data ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Pendapatan" value={formatCurrency(data.revenue)} detail="+12% dari bulan lalu" />
            <StatCard label="Transaksi" value={data.transactions} detail="Seluruh channel" />
            {/* 
               StatCard buat nampilin rata-rata okupansi (persentase pemakaian) seluruh lokasi loker.
            */}
            <StatCard label="Okupansi" value={`${data.occupancy}%`} detail="Rata-rata lokasi" />
            <StatCard label="Kartu aktif" value={data.activeCards} detail="QR valid hari ini" />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
            <Card>
              <h2 className="mb-4 text-lg font-black text-slate-950">Pendapatan bulanan</h2>
              <Bar data={{ labels: reports?.labels || [], datasets: [{ label: 'Pendapatan', data: reports?.revenue || [], backgroundColor: '#0f766e', borderRadius: 8 }] }} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            </Card>
            <Card>
              {/* 
                Ini chart donat buat visualisasi okupansi loker terisi vs kosong.
              */}
              <h2 className="text-lg font-black text-slate-950">Okupansi</h2>
              <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                Persentase unit loker yang sedang aktif disewa (Terisi) dibandingkan loker yang menganggur (Kosong).
              </p>
              <Doughnut data={{ labels: ['Terisi', 'Kosong'], datasets: [{ data: [data.occupancy, 100 - data.occupancy], backgroundColor: ['#0f766e', '#e2e8f0'], borderWidth: 0 }] }} options={{ cutout: '68%' }} />
            </Card>
          </div>
        </>
      ) : null}
    </AdminLayout>
  )
}

export default AdminDashboard
