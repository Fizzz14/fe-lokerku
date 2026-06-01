import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import Button from '../components/Button'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import { adminService, getApiErrorMessage, publicService } from '../services/api'

const masterTypes = ['daerah', 'lokasi', 'ukuran', 'kategori']

const emptyForm = {
  name: '',
  status: 'Aktif',
  regionId: '',
  address: '',
  openHours: '',
  rating: '',
  pricePerDay: '',
}

function AdminMasterData() {
  const queryClient = useQueryClient()
  const [type, setType] = useState('daerah')
  const [form, setForm] = useState({ ...emptyForm })
  const [editingId, setEditingId] = useState(null)
  const [localError, setLocalError] = useState('')

  const { data: items = [], isLoading, isError, error } = useQuery({
    queryKey: ['admin-master', type],
    queryFn: () => adminService.getMasterData(type),
  })

  const { data: regionOptions = [] } = useQuery({
    queryKey: ['regions'],
    queryFn: publicService.getRegions,
    enabled: type === 'lokasi',// kalau si admin buka tab lain misal tab ukuran maka data ke lokasi ga di ambil 
  })

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })//misal name = address dan dia bakal ngambil nilai yg di ketik,trus nyalin isi form nya ...form trs di timpa lalu di perbarui di bagian yg lg di ketik
  }

  function buildPayload() {
    const base = { name: form.name.trim(), status: form.status || 'Aktif' }// trim tu buat ngebuang spasi kosong yg g sngj mw di awl/akhr 
    switch (type) {
      case 'daerah':
        return base
        case 'lokasi':
          return {
            ...base,
            //buat nyimpen data misal daerah dia bakal bikin struktur data yg ad region id dd dsb,ngubah teks dr string dr form jd angka
            regionId: form.regionId,
            address: form.address.trim(),
            openHours: form.openHours.trim(),
            rating: form.rating ? Number(form.rating) : undefined,
        }
      case 'ukuran':
        return {
          ...base,
          pricePerDay: form.pricePerDay ? Number(form.pricePerDay) : undefined,
        }
      case 'kategori':
        return base
      default:
        return base
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!form.name.trim()) return

    setLocalError('')
    const payload = buildPayload()

    // fungsinya buat ngecek saat di submit apakah ada editingId kalau ada brt apdet dta lama klo gd brt bkin baru,udh itu bakal di refresh datanya
    try {
      if (editingId) {
        await adminService.updateMasterData(type, editingId, payload)
      } else {
        await adminService.createMasterData(type, payload)
      }
      await queryClient.invalidateQueries({ queryKey: ['admin-master', type] })
      if (type === 'daerah') {
        await queryClient.invalidateQueries({ queryKey: ['regions'] })
      }
      setForm({ ...emptyForm })
      setEditingId(null)
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Gagal menyimpan data ke server.')
    }
  }

  function handleEdit(item) {
    setEditingId(item.id)
    setForm({
      name: item.name || '',
      status: item.status || 'Aktif',
      regionId: item.regionId || '',
      address: item.address || '',
      openHours: item.openHours || '',
      rating: item.rating || '',
      pricePerDay: item.pricePerDay || '',
    })
  }

  async function handleDelete(id) {
    setLocalError('')
    try {
      await adminService.deleteMasterData(type, id)
      await queryClient.invalidateQueries({ queryKey: ['admin-master', type] })
      if (type === 'daerah') {
        await queryClient.invalidateQueries({ queryKey: ['regions'] })
      }
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Gagal menghapus data dari server.')
    }
  }

  function renderFormFields() {
    switch (type) {
      case 'daerah':
        return (
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Nama daerah</span>
            <input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none" name="name" value={form.name} onChange={handleChange} placeholder="Nama daerah" />
          </label>
        )
      case 'lokasi':
        return (
          <>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Nama lokasi</span>
              <input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none" name="name" value={form.name} onChange={handleChange} placeholder="Nama lokasi" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Daerah</span>
              <select className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none" name="regionId" value={form.regionId} onChange={handleChange}>
                <option value="">Pilih daerah</option>
                {regionOptions.map((region) => (
                  <option key={region.id} value={region.id}>{region.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Alamat</span>
              <input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none" name="address" value={form.address} onChange={handleChange} placeholder="Alamat lengkap" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Jam buka</span>
              <input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none" name="openHours" value={form.openHours} onChange={handleChange} placeholder="06.00 - 22.00" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Rating</span>
              <input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none" name="rating" type="number" step="0.1" value={form.rating} onChange={handleChange} placeholder="4.8" />
            </label>
          </>
        )
      case 'ukuran':
        return (
          <>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Nama ukuran</span>
              <input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none" name="name" value={form.name} onChange={handleChange} placeholder="Kecil / Sedang / Besar" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Harga per hari</span>
              <input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none" name="pricePerDay" type="number" value={form.pricePerDay} onChange={handleChange} placeholder="4000" />
            </label>
          </>
        )
      case 'kategori':
        return (
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Nama kategori</span>
            <input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none" name="name" value={form.name} onChange={handleChange} placeholder="Nama kategori" />
          </label>
        )
      default:
        return null
    }
  }

  function renderTableHeaders() {
    switch (type) {
      case 'daerah':
        return <><th className="px-4 py-3">Nama</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Aksi</th></>
      case 'lokasi':
        return <><th className="px-4 py-3">Nama</th><th className="px-4 py-3">Region ID</th><th className="px-4 py-3">Alamat</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Aksi</th></>
      case 'ukuran':
        return <><th className="px-4 py-3">Nama</th><th className="px-4 py-3">Harga/hari</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Aksi</th></>
      case 'kategori':
        return <><th className="px-4 py-3">Nama</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Aksi</th></>
      default:
        return null
    }
  }

  function renderTableRow(item) {
    switch (type) {
      case 'daerah':
        return <><td className="px-4 py-3 font-semibold text-slate-950">{item.name}</td><td className="px-4 py-3">{item.status}</td></>
      case 'lokasi':
        return <><td className="px-4 py-3 font-semibold text-slate-950">{item.name}</td><td className="px-4 py-3">{item.regionId || '-'}</td><td className="px-4 py-3">{item.address || '-'}</td><td className="px-4 py-3">{item.status}</td></>
      case 'ukuran':
        return <><td className="px-4 py-3 font-semibold text-slate-950">{item.name}</td><td className="px-4 py-3">{item.pricePerDay ? `Rp${Number(item.pricePerDay).toLocaleString('id-ID')}` : '-'}</td><td className="px-4 py-3">{item.status}</td></>
      case 'kategori':
        return <><td className="px-4 py-3 font-semibold text-slate-950">{item.name}</td><td className="px-4 py-3">{item.status}</td></>
      default:
        return null
    }
  }

  const colCount = { daerah: 3, lokasi: 5, ukuran: 4, kategori: 3 }

  return (
    <AdminLayout>
      <PageHeader
        title="Master data"
        description="Kelola data daerah, lokasi, ukuran, dan kategori"
      />

      {localError ? <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{localError}</p> : null}
      {isError ? (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {getApiErrorMessage(error, 'Gagal memuat master data. Login ulang sebagai admin dan pastikan backend aktif.')}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <Card>
          <div className="mb-5 flex flex-wrap gap-2">
            {masterTypes.map((masterType) => (
              <button
                key={masterType}
                className={`rounded-lg px-3 py-2 text-sm font-bold capitalize ${type === masterType ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600'}`}
                type="button"
                onClick={() => {
                  setType(masterType)
                  setEditingId(null)
                  setForm({ ...emptyForm })
                }}
              >
                {masterType}
              </button>
            ))}
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {renderFormFields()}
            <Button type="submit" className="w-full">
              {editingId ? `Edit ${type}` : `Create ${type}`}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-xl font-black capitalize text-slate-950">Data {type}</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  {renderTableHeaders()}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td className="px-4 py-6 text-slate-500" colSpan={colCount[type]}>Memuat data...</td></tr>
                ) : items.map((item) => (
                  <tr key={item.id}>
                    {renderTableRow(item)}
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="secondary" className="px-3 py-2" onClick={() => handleEdit(item)}>Edit</Button>
                        <Button variant="ghost" className="px-3 py-2 text-red-700" onClick={() => handleDelete(item.id)}>Hapus</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default AdminMasterData
