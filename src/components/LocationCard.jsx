// ini buat ngerender detail stasiun kaya nama kota, loker yg tersedia, alamat, dan rating
import { Link } from 'react-router-dom'
import Button from './Button'
import Card from './Card'

function LocationCard({ location }) {
  return (
    <Card className="overflow-hidden p-0">
      {location.image ? (
        <img className="h-44 w-full object-cover" src={location.image} alt={location.name} />
      ) : (
        <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-teal-600 to-teal-800 text-white">
          <div className="text-center">
            <p className="mt-2 text-sm font-semibold">{location.region}</p>
          </div>
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-teal-700">{location.region}</p>
            <h3 className="mt-1 text-xl font-bold text-slate-950">{location.name}</h3>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
            {location.available} tersedia
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{location.address}</p>
        {location.tags?.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {location.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-sm font-semibold text-slate-950">{location.openHours}</p>
            <p className="text-xs text-slate-500">Rating {location.rating} dari pengguna</p>
          </div>
          <Link to={`/lokasi/${location.id}`}>
            <Button>Pilih</Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default LocationCard
