import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import LocationCard from '../components/LocationCard'
import PageHeader from '../components/PageHeader'
import { getApiErrorMessage, lockerService, publicService } from '../services/api'

function CariLoker() {
  const [searchParams, setSearchParams] = useSearchParams()

  const { data: regions = [], isLoading: regionsLoading, isError: regionsError } = useQuery({
    queryKey: ['regions'],
    queryFn: publicService.getRegions,
  })

  const selectedRegion = searchParams.get('region') || regions[0]?.name || 'Jakarta'

  const { data = [], isLoading, isError } = useQuery({
    queryKey: ['locations', selectedRegion],
    queryFn: () => lockerService.getLocations(selectedRegion),
    enabled: !regionsLoading && !regionsError,
  })

  function handleRegionChange(event) {
    setSearchParams({ region: event.target.value })
  }

  return (
    <AppLayout>
      <PageHeader
        eyebrow="Cari lokasi"
        title="Pilih lokasi loker fisik"
      />
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
        <label className="block text-sm font-semibold text-slate-700" htmlFor="region">Kota / daerah</label>
        {regionsLoading ? (
          <p className="mt-2 text-sm text-slate-500">Memuat daerah...</p>
        ) : regionsError ? (
          <p className="mt-2 text-sm font-semibold text-red-700">Gagal memuat daerah: {getApiErrorMessage(regionsError)}</p>
        ) : (
          <select id="region" className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none md:max-w-sm" value={selectedRegion} onChange={handleRegionChange}>
            {regions.map((region) => (
              <option key={region.id} value={region.name}>{region.name}</option>
            ))}
          </select>
        )}
      </div>

      {isLoading ? <LoadingState /> : null}
      {isError ? <EmptyState title="Data gagal dimuat" description="Periksa koneksi API backend atau coba lagi beberapa saat." /> : null}
      {!isLoading && !isError && data.length === 0 ? (
        <EmptyState title="Lokasi belum tersedia" description={`Belum ada lokasi loker untuk ${selectedRegion}.`} />
      ) : null}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {data.map((location) => <LocationCard key={location.id} location={location} />)}
      </div>
    </AppLayout>
  )
}

export default CariLoker
