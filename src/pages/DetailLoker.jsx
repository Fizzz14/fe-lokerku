import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Button from '../components/Button'
import Card from '../components/Card'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import { lockerService } from '../services/api'
import { useBookingStore } from '../store/bookingStore'
import { formatCurrency } from '../utils/format'

function DetailLoker() {
  const { locationId } = useParams()
  const setLocation = useBookingStore((state) => state.setLocation)

  const { data: location, isLoading, isError } = useQuery({
    queryKey: ['location', locationId],
    queryFn: () => lockerService.getLocationById(locationId),
  })

  if (isLoading) return <AppLayout><LoadingState /></AppLayout>
  if (isError || !location) return <AppLayout><EmptyState title="Lokasi tidak ditemukan" description="Lokasi loker yang Anda buka tidak tersedia." /></AppLayout>

  const sizes = location.sizes || []

  function handleStartBooking() {
    setLocation(location)
  }

  // Calculate occupancy from available/total lockers
  const occupancy = location.occupancy != null
    ? location.occupancy
    : (location.lockers > 0 ? Math.round(((location.lockers - location.available) / location.lockers) * 100) : 0)

  return (
    <AppLayout>
      <PageHeader eyebrow={location.region} title={location.name} description={location.address} />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          {location.image ? (
            <img className="h-80 w-full rounded-2xl object-cover shadow-lg shadow-slate-900/10" src={location.image} alt={location.name} />
          ) : (
            <div className="flex h-80 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 shadow-lg shadow-slate-900/10 text-white">
              <div className="text-center">
                <p className="mt-3 text-xl font-black">{location.name}</p>
                <p className="mt-1 text-sm text-teal-100">{location.region}</p>
              </div>
            </div>
          )}
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <Card>
              <p className="text-sm text-slate-500">Jam buka</p>
              <p className="mt-1 font-bold text-slate-950">{location.openHours}</p>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">Kapasitas</p>
              <p className="mt-1 font-bold text-slate-950">{location.lockers} loker</p>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">Tersedia</p>
              <p className="mt-1 font-bold text-emerald-700">{location.available} loker</p>
            </Card>
          </div>
        </div>
        <Card>
          <h2 className="text-xl font-black text-slate-950">Ukuran dan estimasi harga</h2>
          <div className="mt-4 space-y-3">
            {sizes.map((size) => (
              <div key={size.name || size.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold text-slate-950">{size.name}</p>
                  <p className="font-bold text-teal-700">{formatCurrency(size.pricePerDay)}/hari</p>
                </div>
                {size.examples ? (
                  <p className="mt-2 text-sm text-slate-500">Cocok untuk {size.examples.join(', ')}.</p>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">
                    {size.total != null ? `${size.available}/${size.total} tersedia` : ''}
                  </p>
                )}
              </div>
            ))}
          </div>
          <Link to={`/lokasi/${location.id}/sewa`} onClick={handleStartBooking}>
            <Button className="mt-6 w-full">Lanjut sewa</Button>
          </Link>
        </Card>
      </div>
    </AppLayout>
  )
}

export default DetailLoker
