// Layout utama aplikasi. Navbar di atas dan membungkus seluruh halaman biar lebar halamannya rapi, presisi, dan tidak melebar kemana-mana
import Navbar from './Navbar'

function AppLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 sm:py-8 lg:px-8">{children}</main>
    </div>
  )
}

export default AppLayout
