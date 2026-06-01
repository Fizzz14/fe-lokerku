import { useQuery } from '@tanstack/react-query'
import AdminLayout from '../components/AdminLayout'
import Card from '../components/Card'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import { adminService, getApiErrorMessage } from '../services/api'

function AdminManajemenLoker() {
  const { data, isLoading, isError, error } = useQuery({ queryKey: ['admin-lockers'], queryFn: adminService.getLockers })
  const locations = Array.isArray(data) ? data : []

  return (
    <AdminLayout>
      <PageHeader eyebrow="Manajemen" title="Status lokasi dan loker" />
      {isLoading ? <LoadingState /> : null}
      {isError ? (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {getApiErrorMessage(error, 'Gagal memuat data loker dari backend.')}
        </p>
      ) : null}
      <div className="grid gap-5">
        {locations.map((location) => (
          <Card key={location.id}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-700">{location.region}</p>
                <h2 className="mt-1 text-xl font-black text-slate-950">{location.name}</h2>
                <p className="mt-2 text-sm text-slate-500">{location.address}</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xl font-black text-slate-950">{location.lockers}</p>
                  <p className="text-xs text-slate-500">Total</p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-3">
                  <p className="text-xl font-black text-emerald-700">{location.available}</p>
                  <p className="text-xs text-emerald-700">Kosong</p>
                </div>
                <div className="rounded-lg bg-teal-50 p-3">
                  <p className="text-xl font-black text-teal-700">{location.occupancy}%</p>
                  <p className="text-xs text-teal-700">Terisi</p>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-teal-600" style={{ width: `${location.occupancy}%` }} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AdminLayout>
  )
}

export default AdminManajemenLoker
