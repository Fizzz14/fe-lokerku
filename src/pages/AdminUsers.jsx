import { useQuery, useQueryClient } from '@tanstack/react-query'
import AdminLayout from '../components/AdminLayout'
import Button from '../components/Button'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import { adminService, getApiErrorMessage } from '../services/api'

function AdminUsers() {
  const queryClient = useQueryClient()

  const { data: users = [], isLoading, isError, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminService.getUsers,
  })

  async function toggleStatus(user) {
    const newStatus = user.status === 'Aktif' ? 'Nonaktif' : 'Aktif'
    try {
      await adminService.updateUser(user.id, { status: newStatus })
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    } catch (err) {
      alert(getApiErrorMessage(err, 'Gagal mengubah status user.'))
    }
  }

  // Fungsi penanganan klik tombol Hapus untuk menghapus user secara permanen
  async function handleDeleteUser(user) {
    //Tampilkan dialog konfirmasi demi aspek keamanan data
    if (!window.confirm(`Apakah kamu yakin ingin menghapus user "${user.name}"? Semua data booking dan transaksi yang terkait dengan user ini juga akan terhapus otomatis.`)) {
      return
    }

    try {
      await adminService.deleteUser(user.id)
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    } catch (err) {
      alert(getApiErrorMessage(err, 'Gagal menghapus user.'))
    }
  }

  return (
    <AdminLayout>
      <PageHeader
        eyebrow="Manajemen User"
        title="Kelola Akun user"
        description="Aktifkan atau nonaktifkan akun user untuk membatasi akses."
      />

      {isError ? (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {getApiErrorMessage(error, 'Gagal memuat data user.')}
        </p>
      ) : null}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[768px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-3 font-bold uppercase">Nama</th>
                <th className="px-6 py-3 font-bold uppercase">Email / Username</th>
                <th className="px-6 py-3 font-bold uppercase">Telepon</th>
                <th className="px-6 py-3 font-bold uppercase">Role</th>
                <th className="px-6 py-3 font-bold uppercase">Status</th>
                <th className="px-6 py-3 font-bold uppercase text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                    Memuat data user...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                    Belum ada data user.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-950">{user.name}</td>
                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                    <td className="px-6 py-4 text-slate-600">{user.phone}</td>
                    <td className="px-6 py-4 text-slate-600 capitalize">{user.role}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          user.status === 'Aktif'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      {user.role !== 'admin' && (
                        <>
                          {/* Tombol untuk Mengaktifkan/Nonaktifkan Akun User */}
                          <Button
                            variant={user.status === 'Aktif' ? 'secondary' : 'primary'}
                            className={`text-xs ${user.status === 'Aktif' ? 'text-red-600 hover:bg-red-50' : ''}`}
                            onClick={() => toggleStatus(user)}
                          >
                            {user.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                          </Button>
                          
                          {/* Tombol untuk Menghapus Akun User Secara Permanen (Cascade) */}
                          <Button
                            variant="ghost"
                            className="text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDeleteUser(user)}
                          >
                            Hapus
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminLayout>
  )
}

export default AdminUsers
