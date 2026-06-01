import { useQuery } from '@tanstack/react-query'
import { Line } from 'react-chartjs-2'
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js'
import AdminLayout from '../components/AdminLayout'
import Card from '../components/Card'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import { adminService } from '../services/api'
import { formatCurrency } from '../utils/format'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend)

function AdminLaporan() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-reports'], queryFn: adminService.getReports })

  return (
    <AdminLayout>
      <PageHeader eyebrow="Laporan" title="Pendapatan dan okupansi" />
      {isLoading ? <LoadingState /> : null}
      {data ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <Card>
            {/* 
              Okupansi itu gunanya buat ngukur seberapa produktif loker kita, alias persentase loker yang keisi.
              Biar admin tau loker di stasiun mana aja yang paling laku disewa
            */}
            <h2 className="text-lg font-black text-slate-950">Tren okupansi</h2>
            <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
              Okupansi mengukur tingkat pemakaian loker. Berguna untuk mengetahui seberapa produktif loker kita,semakin tinggi persentasenya, semakin sering loker tersebut aktif disewa oleh pengguna.
            </p>
            <Line
              data={{
                labels: data.labels,
                datasets: [
                  {
                    label: 'Okupansi (%)',
                    data: data.occupancy,
                    borderColor: '#0f766e',
                    backgroundColor: 'rgba(15, 118, 110, 0.12)',
                    tension: 0.35,
                  },
                ],
              }}
            />
          </Card>
          <Card>
            <h2 className="text-lg font-black text-slate-950">Ringkasan bulanan</h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Bulan</th>
                    <th className="px-4 py-3">Pendapatan</th>
                    <th className="px-4 py-3">Okupansi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.labels.map((label, index) => (
                    <tr key={label}>
                      <td className="px-4 py-3 font-semibold text-slate-950">{label}</td>
                      <td className="px-4 py-3">{formatCurrency(data.revenue[index])}</td>
                      <td className="px-4 py-3">{data.occupancy[index]}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : null}
    </AdminLayout>
  )
}

export default AdminLaporan
