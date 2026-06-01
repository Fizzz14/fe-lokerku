import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import RoleRedirect from '../components/RoleRedirect'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import CariLoker from '../pages/CariLoker'
import DetailLoker from '../pages/DetailLoker'
import FormSewa from '../pages/FormSewa'
import Riwayat from '../pages/Riwayat'
import DetailKartu from '../pages/DetailKartu'
import EditProfile from '../pages/EditProfile'
import UserDashboard from '../pages/UserDashboard'
import AdminDashboard from '../pages/AdminDashboard'
import AdminExportData from '../pages/AdminExportData'
import AdminLaporan from '../pages/AdminLaporan'
import AdminManajemenLoker from '../pages/AdminManajemenLoker'
import AdminMasterData from '../pages/AdminMasterData'
import AdminRelasiTransaction from '../pages/AdminRelasiTransaction'
import AdminUsers from '../pages/AdminUsers'
import NotFound from '../pages/NotFound'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<RoleRedirect />} />
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cari-loker"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <CariLoker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lokasi/:locationId"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <DetailLoker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lokasi/:locationId/sewa"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <FormSewa />
            </ProtectedRoute>
          }
        />
        <Route
          path="/riwayat"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <Riwayat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kartu/:transactionId"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <DetailKartu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/laporan"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLaporan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/loker"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminManajemenLoker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/master"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminMasterData />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/relasi"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminRelasiTransaction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/export"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminExportData />
            </ProtectedRoute>
          }
        />
        <Route path="/user/dashboard" element={<Navigate to="/user" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
