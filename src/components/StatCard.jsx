// ini buat card yg isinya kaya jumlah pendapatan, total transaksi, persentase okupansi, atau kartu aktif
import Card from './Card'

function StatCard({ label, value, detail }) {
  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
      {detail ? <p className="mt-2 text-sm text-teal-700">{detail}</p> : null}
    </Card>
  )
}

export default StatCard
