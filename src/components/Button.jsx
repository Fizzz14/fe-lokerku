// Tombol custom yang bisa dipakai berulang kali. Mendukung berbagai varian gaya seperti primary (hijau teal), secondary (putih abu), dark (hitam), dan ghost (transparan) agar tampilan tombol selaras di semua halaman
const variants = {
  primary: 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm shadow-teal-900/15',
  secondary: 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50',
  dark: 'bg-slate-950 text-white hover:bg-slate-800',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
}

function Button({ children, variant = 'primary', className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}// buat nerusin
    >
      {children}
    </button>
  )
}

export default Button
