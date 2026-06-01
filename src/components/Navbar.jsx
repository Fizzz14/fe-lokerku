import { Link, NavLink } from 'react-router-dom'
import Button from './Button'
import { useAuth } from '../hooks/useAuth'

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const userHome = user?.role === 'admin' ? '/admin' : '/user'
  const navLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition ${
      isActive ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-100'
    }`
  const mobileLinkClass = ({ isActive }) =>
    `flex flex-1 flex-col items-center justify-center rounded-lg px-2 py-2 text-[11px] font-bold transition ${
      isActive ? 'bg-slate-950 text-white' : 'text-slate-500'
    }`

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <div className="min-w-0">
              <p className="truncate text-lg font-black tracking-tight text-slate-950">Lokerku</p>
              <p className="hidden text-xs font-medium text-slate-500 sm:block">Smart locker rental</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {user?.role !== 'admin' ? (
              <>
                <NavLink className={navLinkClass} to="/cari-loker">
                  Cari Loker
                </NavLink>
                <NavLink className={navLinkClass} to="/riwayat">
                  Riwayat
                </NavLink>
              </>
            ) : null}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link className="hidden max-w-36 truncate text-sm font-semibold text-slate-600 sm:block" to={userHome}>
                  {user?.name}
                </Link>
                <Button variant="secondary" className="px-3 py-2 sm:px-4 sm:py-2.5" onClick={logout}>
                  Keluar
                </Button>
              </>
            ) : (
              <>
                <Link className="text-sm font-semibold text-slate-600" to="/login">
                  Login
                </Link>
                <Link to="/register">
                  <Button className="px-3 py-2 sm:px-4 sm:py-2.5">Daftar</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {isAuthenticated ? (
        <nav className="fixed inset-x-3 bottom-3 z-40 flex gap-1 rounded-xl border border-slate-200 bg-white/95 p-2 shadow-2xl shadow-slate-900/15 backdrop-blur md:hidden">
          <NavLink className={mobileLinkClass} to={userHome}>
            Dashboard
          </NavLink>
          <NavLink className={mobileLinkClass} to="/profile">
            Profil
          </NavLink>
          {user?.role === 'admin' ? (
            <>
              <NavLink className={mobileLinkClass} to="/admin/laporan">
                Laporan
              </NavLink>
              <NavLink className={mobileLinkClass} to="/admin/loker">
                Loker
              </NavLink>
              <NavLink className={mobileLinkClass} to="/admin/master">
                Master
              </NavLink>
            </>
          ) : (
            <>
              <NavLink className={mobileLinkClass} to="/cari-loker">
                Cari
              </NavLink>
              <NavLink className={mobileLinkClass} to="/riwayat">
                Riwayat
              </NavLink>
            </>
          )}
        </nav>
      ) : null}
    </>
  )
}

export default Navbar
