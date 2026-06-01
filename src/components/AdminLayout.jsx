// Layout khusus untuk halaman admin. Kodenya membungkus menu navigasi samping/atas admin (dashboard, laporan, kelola user, dll) dan menyalurkan konten utamanya lewat children
import { NavLink } from 'react-router-dom'
import AppLayout from './AppLayout'

function AdminLayout({ children }) {
  const linkClass = ({ isActive }) =>
    `rounded-lg px-4 py-2 text-sm font-semibold transition ${
      isActive ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-white'
    }`

  return (
    <AppLayout>
      <div className="mb-6 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-100 p-2">
        <NavLink to="/admin" end className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/admin/laporan" className={linkClass}>
          Laporan
        </NavLink>
        <NavLink to="/admin/loker" className={linkClass}>
          Manajemen Loker
        </NavLink>
        <NavLink to="/admin/master" className={linkClass}>
          Master Data
        </NavLink>
        <NavLink to="/admin/relasi" className={linkClass}>
          Relasi
        </NavLink>
        <NavLink to="/admin/users" className={linkClass}>
          Kelola User
        </NavLink>
        <NavLink to="/admin/export" className={linkClass}>
          Export
        </NavLink>
      </div>
      {children}
    </AppLayout>
  )
}

export default AdminLayout
