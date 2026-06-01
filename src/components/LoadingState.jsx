// cmn buat nampilin loading aja pas nge fetch data
function LoadingState({ label = 'Memuat data...' }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-8 text-center text-sm text-slate-500">
      <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600" />
      {label}
    </div>
  )
}

export default LoadingState
