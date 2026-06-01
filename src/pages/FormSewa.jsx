import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Button from '../components/Button'
import Card from '../components/Card'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import SizeSelector from '../components/SizeSelector'
import { getApiErrorMessage, lockerService } from '../services/api'
import { useBookingStore } from '../store/bookingStore'
import { formatCurrency } from '../utils/format'

function FormSewa() {
  const { locationId } = useParams()
  const navigate = useNavigate()

  // Ambil data sewa dan tombol fungsinya dari store global (Zustand)
  const selectedSize = useBookingStore((state) => state.selectedSize)
  const setSize = useBookingStore((state) => state.setSize)
  const duration = useBookingStore((state) => state.duration)
  const increaseDuration = useBookingStore((state) => state.increaseDuration)
  const decreaseDuration = useBookingStore((state) => state.decreaseDuration)
  const setLastBooking = useBookingStore((state) => state.setLastBooking)
  const resetBooking = useBookingStore((state) => state.resetBooking)

  // Reset form sewa ke kondisi awal setiap kali halaman dibuka biar gak nyimpen angka dari user sebelumnya
  useEffect(() => {
    resetBooking()
  }, [resetBooking])

  // State lokal buat nyimpen nama barang yang diketik sama user
  const [itemName, setItemName] = useState('')
  const [matchedInfo, setMatchedInfo] = useState({ size: '', keyword: '' })

  // nebak ukuran loker otomatis berdasarkan nama barang yang diketik user
  function detectSize(text) {
    const t = text.toLowerCase().trim()
    if (!t) return { size: selectedSize, keyword: '' } // Kalau kosong, balikin ke ukuran default sebelumnya

    // Barang raksasa, koper jumbo, stroller, atau sepeda
    const veryLargeItems = [
      'sepeda', 'bicycle', 'sepeda lipat', 'skuter', 'scooter', 'stroller', 'kereta bayi', 'baby stroller',
      'koper jumbo', 'koper super', 'koper xl', 'koper xxl', 'giant suitcase', 'kardus besar', 'box besar', 'karung',
      'carrier', 'tas carrier', 'tas gunung', 'backpack gunung', 'hiking bag', 'hiking backpack', 'tenda', 'tent',
      'gitar', 'guitar', 'bass', 'drum', 'keyboard besar', 'biola', 'alat musik', 'tv', 'televisi', 'television',
      'golf', 'tas golf', 'golf bag', 'papan seluncur', 'surfboard', 'sangat besar', 'very large', 'super jumbo'
    ]
    const matchedVeryLarge = veryLargeItems.find(word => t.includes(word))
    if (matchedVeryLarge) return { size: 'Sangat Besar', keyword: matchedVeryLarge }

    // Koper standar, tas travel besar, kardus ukuran sedang-besar
    const largeItems = [
      'koper', 'suitcase', 'travel bag', 'tas travel', 'tas pakaian', 'duffel bag', 'duffle bag',
      'ransel besar', 'backpack besar', 'tas olahraga', 'gym bag', 'sports bag', 'tas mudik', 'tas jinjing besar',
      'kardus', 'box', 'karton', 'belanjaan', 'kantong belanja', 'shopping bag', 'galon', 'water gallon',
      'toolbox', 'kotak perkakas', 'perkakas', 'vacuum cleaner', 'sapu', 'pelan', 'microwave', 'oven',
      'skateboard', 'papan skate', 'tas bayi', 'diaper bag', 'mantel', 'winter coat', 'besar', 'large'
    ]
    const matchedLarge = largeItems.find(word => t.includes(word))
    if (matchedLarge) return { size: 'Besar', keyword: matchedLarge }

    // Helm, tas sekolah standar, jaket tebal, sepatu, dll.
    const mediumItems = [
      'helm', 'helmet', 'helm motor', 'helm sepeda', 'ransel', 'backpack', 'daypack', 'tas punggung',
      'tas', 'bag', 'tas sekolah', 'school bag', 'tas buku', 'tote bag', 'totebag', 'goodie bag', 'goody bag',
      'sling bag', 'slingbag', 'tas selempang', 'waist bag', 'waistbag', 'tas pinggang', 'handbag', 'hand bag',
      'tas tangan', 'tas kurir', 'messenger bag', 'clutch', 'sepatu', 'shoes', 'sneakers', 'boots', 'heels',
      'flat shoes', 'sandal', 'slippers', 'jaket', 'jacket', 'sweater', 'hoodie', 'outerwear', 'baju', 'kaos',
      'celana', 'pakaian', 'payung', 'umbrella', 'jas hujan', 'raincoat', 'botol', 'bottle', 'tumbler', 'termos',
      'thermos', 'bekal', 'tempat makan', 'lunch box', 'buku', 'book', 'novel', 'binder', 'dokumen tebal',
      'speaker portable', 'speaker', 'headphone', 'headphones', 'camera bag', 'tas kamera', 'sedang', 'medium'
    ]
    const matchedMedium = mediumItems.find(word => t.includes(word))
    if (matchedMedium) return { size: 'Sedang', keyword: matchedMedium }

    // Barang kecil esensial, gadget, dompet, kunci, dokumen rahasia, dll.
    const smallItems = [
      'laptop', 'notebook', 'macbook', 'netbook', 'hp', 'handphone', 'smartphone', 'telepon', 'iphone', 'android',
      'tablet', 'ipad', 'tab', 'kamera', 'camera', 'mirrorless', 'dslr', 'gopro', 'digicam', 'powerbank', 'power bank',
      'charger', 'casan', 'mouse', 'keyboard', 'headset', 'earphone', 'airpods', 'tws', 'harddisk', 'hdd', 'ssd',
      'flashdisk', 'usb', 'nintendo', 'switch', 'nintendo switch', 'psp', 'ps5', 'xbox', 'gamepad', 'stick game',
      'remote', 'smartwatch', 'jam tangan', 'jam', 'watch', 'kabel', 'cable', 'dompet', 'wallet', 'pouch', 'kunci',
      'key', 'kunci motor', 'kunci mobil', 'kunci rumah', 'stnk', 'sim', 'ktp', 'bpkb', 'passport', 'paspor',
      'dokumen', 'surat', 'uang', 'money', 'cash', 'dompet koin', 'emas', 'gold', 'perhiasan', 'jewelry', 'cincin',
      'ring', 'kalung', 'gelang', 'anting', 'kacamata', 'glasses', 'sunglasses', 'makeup', 'make up', 'kosmetik',
      'skincare', 'lipstik', 'lipstick', 'parfum', 'perfume', 'obat', 'medicine', 'vitamin', 'kecil', 'small'
    ]
    const matchedSmall = smallItems.find(word => t.includes(word))
    if (matchedSmall) return { size: 'Kecil', keyword: matchedSmall }

    // Kalau nama barangnya gak ada di list tapi lebih dari 2 huruf, defaultin ke Sedang
    if (t.length > 2) return { size: 'Sedang', keyword: 'barang umum' }

    return { size: selectedSize, keyword: '' }
  }

  // Fungsi yang kepanggil tiap kali user ngetik di kolom input barang
  function handleItemChange(e) {
    const val = e.target.value
    setItemName(val) // Update teks di layar

    // Tebak ukuran loker yang cocok berdasarkan ketikan user
    const result = detectSize(val)
    setMatchedInfo({ size: result.size, keyword: result.keyword })
    if (result.size !== selectedSize) {
      setSize(result.size) // Otomatis ganti ukuran loker terpilih!
    }
  }

  // Ambil data detail lokasi loker dari API backend berdasarkan ID lokasi di URL
  const { data: location, isLoading } = useQuery({
    queryKey: ['location', locationId],
    queryFn: () => lockerService.getLocationById(locationId),
  })

  // Dapatkan daftar ukuran yang tersedia di lokasi ini
  const sizes = location?.sizes || []

  // Cari objek ukuran loker yang aktif saat ini dari database
  const activeSize = useMemo(() => {
    // Cari yang ID-nya sama
    const byId = sizes.find((size) => size.id === selectedSize)
    if (byId) return byId
    // Cari yang namanya sama secara case-insensitive
    return sizes.find((size) => size.name?.toLowerCase() === selectedSize?.toLowerCase())
  }, [selectedSize, sizes])

  // Hitung total harga sewa (harga harian dikali durasi hari)
  const total = (activeSize?.pricePerDay || 0) * duration

  // Fungsi mutation buat ngirim data transaksi ke backend pas klik submit
  const mutation = useMutation({
    mutationFn: lockerService.createBooking,
    onSuccess: (booking) => {
      setLastBooking(booking) // Simpan data transaksi terakhir ke store
      navigate(`/kartu/${booking.id}`) // Pindah halaman ke tampilan QR Code akses!
    },
  })

  // Fungsi pas user menekan tombol "Submit sewa"
  function handleSubmit(event) {
    event.preventDefault()
    if (!itemName.trim()) {
      alert('Tuliskan dulu barang apa yang disimpan.')
      return
    }

    // Trigger pengiriman data sewa ke API backend
    mutation.mutate({
      locationId,
      size: activeSize?.name || 'Sedang',
      duration,
      total,
      notes: itemName, // Simpan nama barang di kolom notes/catatan transaksi
    })
  }

  // Tampilkan loading screen kalau data lokasi masih di-fetch dari API
  if (isLoading) return <AppLayout><LoadingState /></AppLayout>

  return (
    <AppLayout>
      {/* Header Halaman */}
      <PageHeader
        eyebrow="Form sewa"
        title={`Sewa loker di ${location?.name || 'Lokerku'}`}
        description="Pilih ukuran, atur durasi dengan tombol plus/minus, lalu submit untuk mendapatkan QR akses."
      />

      {/* Form Utama */}
      <form className="grid gap-6 lg:grid-cols-[1fr_380px]" onSubmit={handleSubmit}>
        <div className="space-y-6">

          {/* Bagian Input Nama Barang */}
          <Card>
            <h2 className="text-lg font-black text-slate-950">Apa yang ingin Anda simpan?</h2>
            <p className="mt-1 text-sm text-slate-500">Tuliskan nama barang, sistem akan merekomendasikan ukuran terbaik.</p>
            <input
              className="mt-4 w-full rounded-lg border border-slate-200 px-4 py-4 text-lg font-semibold focus:border-teal-500 focus:outline-none"
              value={itemName}
              onChange={handleItemChange}
              placeholder="Contoh: Koper, Laptop, Helm..."
              required
            />
            {matchedInfo.keyword && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-teal-50/70 border border-teal-100 p-3.5 text-xs text-teal-800 font-semibold leading-relaxed">
                <span>
                  Sistem memilih loker tipe <strong className="text-teal-950 font-black">{matchedInfo.size}</strong> karena mendeteksi barang: <strong className="text-teal-950 font-black">"{matchedInfo.keyword}"</strong>.
                </span>
              </div>
            )}
          </Card>

          {/* Bagian Pilihan Ukuran Loker */}
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-950">Ukuran loker</h2>
              {itemName && (
                <span className="text-xs font-bold uppercase text-teal-600 bg-teal-50 px-2 py-1 rounded">Terpilih Otomatis</span>
              )}
            </div>
            <div className="mt-4">
              <SizeSelector value={selectedSize} onChange={setSize} sizes={sizes} />
            </div>
          </Card>
        </div>

        {/* Bagian Ringkasan & Kalkulator Total Pembayaran (Kanan) */}
        <Card className="h-fit">
          <h2 className="text-lg font-black text-slate-950">Ringkasan sewa</h2>

          {/* Tombol Plus Minus Durasi Hari */}
          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Durasi</p>
            <div className="mt-3 flex items-center justify-between">
              <Button variant="secondary" onClick={decreaseDuration} className="h-11 w-11 px-0">-</Button>
              <span className="text-2xl font-black text-slate-950">{duration} hari</span>
              <Button variant="secondary" onClick={increaseDuration} className="h-11 w-11 px-0">+</Button>
            </div>
          </div>

          {/* Rincian Harga */}
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Ukuran</span><span className="font-bold text-slate-950">{activeSize?.name}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Harga harian</span><span className="font-bold text-slate-950">{formatCurrency(activeSize?.pricePerDay)}</span></div>
            <div className="flex justify-between border-t border-slate-200 pt-3 text-base"><span className="font-bold text-slate-950">Total</span><span className="font-black text-teal-700">{formatCurrency(total)}</span></div>
          </div>

          {/* Pesan Error jika pembuatan transaksi gagal */}
          {mutation.isError ? (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">
              {getApiErrorMessage(mutation.error, 'Transaksi gagal dibuat.')}
            </p>
          ) : null}

          {/* Tombol Kirim */}
          <Button type="submit" className="mt-6 w-full" disabled={mutation.isPending}>{mutation.isPending ? 'Mengirim...' : 'Submit sewa'}</Button>
        </Card>
      </form>
    </AppLayout>
  )
}

export default FormSewa
