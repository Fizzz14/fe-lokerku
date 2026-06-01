import { useQuery } from '@tanstack/react-query'
import AdminLayout from '../components/AdminLayout'
import Button from '../components/Button'
import Card from '../components/Card'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import { adminService } from '../services/api'

function AdminRelasiTransaction() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-relations'],
    queryFn: adminService.getRelations,
  })

  const rows = Array.isArray(data) ? data : []

  async function handleToggleCard(cardId, currentStatus) {
    if (!cardId) return
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active'
    try {
      await adminService.updateCardStatus(cardId, nextStatus)
      refetch()
    } catch (err) {
      alert('Gagal memperbarui status kartu')
    }
  }
  return (
    <AdminLayout>
      <PageHeader
        eyebrow="Relasi"
        title="Relasi data dan database transaction"
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <h2 className="text-xl font-black text-slate-950">Data relasi</h2>
          {isLoading ? <div className="mt-4"><LoadingState /></div> : null}
          {!isLoading ? (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Transaksi</th>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Lokasi</th>
                    <th className="px-4 py-3">Loker</th>
                    <th className="px-4 py-3">Kode Kartu</th>
                    <th className="px-4 py-3">Status Kartu</th>
                    <th className="px-4 py-3 text-right">Aksi Kartu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 font-bold text-slate-950">{item.id}</td>
                      <td className="px-4 py-3">{item.user}</td>
                      <td className="px-4 py-3">{item.location}</td>
                      <td className="px-4 py-3">{item.locker}</td>
                      <td className="px-4 py-3 font-mono">{item.card}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold capitalize ${item.cardStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {item.cardStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {item.cardId && (
                          <Button 
                            variant="ghost" 
                            className={`px-2 py-1 text-xs font-bold ${item.cardStatus === 'active' ? 'text-red-600' : 'text-teal-600'}`}
                            onClick={() => handleToggleCard(item.cardId, item.cardStatus)}
                          >
                            {item.cardStatus === 'active' ? 'Matikan' : 'Aktifkan'}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </Card>
      </div>
    </AdminLayout>
  )
}

export default AdminRelasiTransaction
