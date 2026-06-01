// ini tuh buat roleredirect jadi kalau admin ke admin kalau user ke user gitu
import { Navigate } from 'react-router-dom'
import LoadingState from './LoadingState'
import { useAuth } from '../hooks/useAuth'

function RoleRedirect() {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) return <LoadingState label="Mengarahkan dashboard..." />

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={user?.role === 'admin' ? '/admin' : '/user'} replace />
}

export default RoleRedirect
