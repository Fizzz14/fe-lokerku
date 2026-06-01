import { Link } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'

function NotFound() {
  return (
    <AppLayout>
      <EmptyState
        title="Halaman tidak ditemukan"
        description="URL yang dibuka tidak cocok dengan routing aplikasi Lokerku."
        action={<Link to="/"><Button>Kembali ke Home</Button></Link>}
      />
    </AppLayout>
  )
}

export default NotFound
