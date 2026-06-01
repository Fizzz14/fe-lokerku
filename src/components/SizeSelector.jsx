// Pemilih Ukuran Loker Size Selector Merender pilihan ukuran loker fisik Kecil, Sedang, Besar, Sangat Besar 
import { formatCurrency } from '../utils/format'

const enrichedDetails = {
  kecil: {
    capacity: 'Loker mini esensial',
    examples: ['Laptop', 'Tablet', 'HP', 'Dokumen/Dompet'],
  },
  sedang: {
    capacity: 'Loker harian standar',
    examples: ['Helm', 'Ransel', 'Sepatu', 'Jaket'],
  },
  besar: {
    capacity: 'Loker besar bagasi',
    examples: ['Koper Medium', 'Tas Travel', 'Tas Belanja'],
  },
  'sangat besar': {
    capacity: 'Loker jumbo super',
    examples: ['Koper Jumbo', 'Sepeda Lipat', 'Stroller', 'Tas Gunung'],
  },
}

function SizeSelector({ value, onChange, sizes = [] }) {
  if (sizes.length === 0) {
    return <p className="text-sm text-slate-500">Ukuran loker belum tersedia di lokasi ini.</p>
  }

  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      {sizes.map((size) => {
        const sizeNameKey = size.name?.toLowerCase()
        const detail = enrichedDetails[sizeNameKey] || {}
        
        // Match by id or by name (lowercase comparison)
        const sizeKey = size.id || sizeNameKey
        const selected = value === sizeKey || value === sizeNameKey
        return (
          <button
            key={sizeKey}
            type="button"
            onClick={() => onChange(sizeKey)}
            className={`focus-ring rounded-xl border p-4 text-left transition flex flex-col justify-between ${
              selected ? 'border-teal-600 bg-teal-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-1">
                <p className="text-lg font-bold text-slate-950">{size.name}</p>
                <span className="text-sm font-black text-teal-700">{formatCurrency(size.pricePerDay)}/hari</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-500">{detail.capacity || size.capacity || 'Kapasitas standar'}</p>
            </div>
            {detail.examples || size.examples ? (
              <p className="mt-4 text-xs leading-5 text-slate-600">
                Cocok untuk: <span className="font-bold text-slate-800">{(detail.examples || size.examples).join(', ')}</span>.
              </p>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

export default SizeSelector
