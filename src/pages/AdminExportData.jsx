import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import Button from '../components/Button'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import { adminService } from '../services/api'
import { formatCurrency } from '../utils/format'

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function AdminExportData() {
  const [activeTab, setActiveTab] = useState('transaksi')

  const { data: relations = [] } = useQuery({
    queryKey: ['admin-relations'],
    queryFn: adminService.getRelations,
  })

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminService.getUsers,
  })

  function exportPdf() {
    const doc = new jsPDF()
    if (activeTab === 'transaksi') {
      doc.text('Laporan Transaksi Lokerku', 14, 16)
      autoTable(doc, {
        startY: 24,
        head: [['ID', 'User', 'Lokasi', 'Loker', 'Kode Kartu', 'Status']],
        body: relations.map((item) => [item.id, item.user, item.location, item.locker, item.card, item.status]),
      })
      doc.save('laporan-transaksi-lokerku.pdf')
    } else {
      doc.text('Laporan Akun Pelanggan Lokerku', 14, 16)
      autoTable(doc, {
        startY: 24,
        head: [['Nama', 'Email / Username', 'Telepon', 'Role', 'Status']],
        body: users.map((u) => [u.name, u.email, u.phone, u.role, u.status]),
      })
      doc.save('laporan-pelanggan-lokerku.pdf')
    }
  }

  function exportXlsx() {
    const docData = activeTab === 'transaksi' 
      ? relations 
      : users.map(u => ({ Nama: u.name, Email: u.email, Telepon: u.phone, Role: u.role, Status: u.status }))
    const worksheet = XLSX.utils.json_to_sheet(docData)
    const workbook = XLSX.utils.book_new()
    const sheetName = activeTab === 'transaksi' ? 'Transaksi' : 'Pelanggan'
    const fileName = activeTab === 'transaksi' ? 'laporan-transaksi-lokerku.xlsx' : 'laporan-pelanggan-lokerku.xlsx'
    
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    XLSX.writeFile(workbook, fileName)
  }

  function exportImage() {
    let rows = ''
    let title = ''
    let filename = ''
    if (activeTab === 'transaksi') {
      title = 'Laporan Transaksi Lokerku'
      filename = 'laporan-transaksi-lokerku.svg'
      rows = relations.map((item, index) => `<text x="40" y="${95 + index * 32}" font-size="16" fill="#334155">${item.id} - ${item.user} - ${item.location} - ${item.status}</text>`).join('')
    } else {
      title = 'Laporan Akun Pelanggan Lokerku'
      filename = 'laporan-pelanggan-lokerku.svg'
      rows = users.map((u, index) => `<text x="40" y="${95 + index * 32}" font-size="16" fill="#334155">${u.name} - ${u.email} - Status: ${u.status}</text>`).join('')
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="420"><rect width="100%" height="100%" fill="#f8fafc"/><text x="40" y="48" font-size="26" font-weight="700" fill="#0f172a">${title}</text>${rows}</svg>`
    downloadBlob(svg, filename, 'image/svg+xml')
  }

  return (
    <AdminLayout>
      <PageHeader eyebrow="Export" title="Export data" description="Export laporan transaksi dan data akun pelanggan." />
      
      {/* Tab Switcher Premium */}
      <div className="mb-6 flex gap-2 border-b border-slate-200 pb-px">
        <button
          type="button"
          onClick={() => setActiveTab('transaksi')}
          className={`border-b-2 px-4 py-2.5 text-sm font-black transition ${
            activeTab === 'transaksi'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Data Transaksi Loker
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pelanggan')}
          className={`border-b-2 px-4 py-2.5 text-sm font-black transition ${
            activeTab === 'pelanggan'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Data Akun Pelanggan
        </button>
      </div>

      <Card>
        <div className="grid gap-3 sm:flex">
          <Button onClick={exportPdf}>Export PDF</Button>
          <Button variant="secondary" onClick={exportXlsx}>Export XLSX</Button>
          <Button variant="secondary" onClick={exportImage}>Export Image</Button>
        </div>
        
        {activeTab === 'transaksi' ? (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-bold uppercase">ID</th>
                  <th className="px-4 py-3 font-bold uppercase">User</th>
                  <th className="px-4 py-3 font-bold uppercase">Lokasi</th>
                  <th className="px-4 py-3 font-bold uppercase">Loker</th>
                  <th className="px-4 py-3 font-bold uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {relations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-950">{item.id}</td>
                    <td className="px-4 py-3">{item.user}</td>
                    <td className="px-4 py-3">{item.location}</td>
                    <td className="px-4 py-3">{item.locker}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold ${
                        item.status === 'Aktif'
                          ? 'bg-emerald-50 text-emerald-700'
                          : item.status === 'Nonaktif'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-bold uppercase">Nama</th>
                  <th className="px-4 py-3 font-bold uppercase">Email / Username</th>
                  <th className="px-4 py-3 font-bold uppercase">Telepon</th>
                  <th className="px-4 py-3 font-bold uppercase">Role</th>
                  <th className="px-4 py-3 font-bold uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-950">{u.name}</td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3 text-slate-600">{u.phone}</td>
                    <td className="px-4 py-3 text-slate-600 capitalize">{u.role}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${u.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AdminLayout>
  )
}

export default AdminExportData
