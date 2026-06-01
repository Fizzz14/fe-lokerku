// Memastikan hanya user yang sudah login yang bisa masuk, serta membatasi akses halaman berdasarkan level role (misalnya halaman admin hanya boleh dimasuki admin)
import { Navigate, useLocation } from 'react-router-dom'
import LoadingState from './LoadingState'
import { useAuth } from '../hooks/useAuth'

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingState label="Memeriksa sesi..." />

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/user'} replace />
  }

  return children
}

export default ProtectedRoute
