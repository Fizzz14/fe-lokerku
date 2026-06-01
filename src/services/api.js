import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lokerku_token') || sessionStorage.getItem('lokerku_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.message = `Tidak dapat terhubung ke server (${API_BASE_URL}). Pastikan backend berjalan.`
    }

    const status = error.response?.status
    if (status === 401 || status === 403) {
      const hadToken = Boolean(localStorage.getItem('lokerku_token') || sessionStorage.getItem('lokerku_token'))
      localStorage.removeItem('lokerku_token')
      localStorage.removeItem('lokerku_user')
      sessionStorage.removeItem('lokerku_token')
      sessionStorage.removeItem('lokerku_user')
      if (hadToken && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login?reason=session'
      }
    }

    return Promise.reject(error)
  },
)

export function getApiErrorMessage(error, fallback = 'Terjadi kesalahan.') {
  return error?.response?.data?.message || error?.message || fallback
}

export const publicService = {
  async getRegions() {
    const { data } = await api.get('/api/regions')
    return data
  },

  async getLockerSizes() {
    const { data } = await api.get('/api/sizes')
    return data
  },
}

export const authService = {
  async login(payload) {
    const { data } = await api.post('/api/auth/login', payload)
    return data
  },

  async register(payload) {
    const { data } = await api.post('/api/auth/register', payload)
    return data
  },
}

export const userService = {
  async updateProfile(payload) {
    const { data } = await api.put('/api/users/me', payload)
    return data
  },

  async uploadPhoto(file) {
    const formData = new FormData()
    formData.append('image', file)
    const { data } = await api.post('/api/users/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },
}

export function getImageUrl(path) {
  if (!path) return 'https://ui-avatars.com/api/?name=User&background=random'
  if (path.startsWith('http')) return path
  return `${API_BASE_URL}${path}`
}

export const lockerService = {
  async getLocations(region = 'Jakarta') {
    const { data } = await api.get('/api/locations', { params: { region } })
    return data
  },

  async getLocationById(id) {
    const { data } = await api.get(`/api/locations/${id}`)
    return data
  },

  async createBooking(payload) {
    const { data } = await api.post('/api/bookings', payload)
    return data
  },

  async getMyTransactions() {
    const { data } = await api.get('/api/bookings/me')
    return data
  },

  async getAccessCard(transactionId) {
    const { data } = await api.get(`/api/cards/${transactionId}`)
    return data
  },
}

export const adminService = {
  async getSummary() {
    const { data } = await api.get('/api/admin/summary')
    return data
  },

  async getReports() {
    const { data } = await api.get('/api/admin/reports')
    return data
  },

  async getLockers() {
    const { data } = await api.get('/api/admin/lockers')
    return data
  },

  async getMasterData(type) {
    const { data } = await api.get(`/api/admin/master/${type}`)
    return data
  },

  async createMasterData(type, payload) {
    const { data } = await api.post(`/api/admin/master/${type}`, payload)
    return data
  },

  async updateMasterData(type, id, payload) {
    const { data } = await api.put(`/api/admin/master/${type}/${id}`, payload)
    return data
  },

  async deleteMasterData(type, id) {
    const { data } = await api.delete(`/api/admin/master/${type}/${id}`)
    return data
  },

  async getRelations() {
    const { data } = await api.get('/api/admin/relations')
    return data
  },

  async simulateDatabaseTransaction(payload) {
    const { data } = await api.post('/api/admin/transactions/simulate', payload)
    return data
  },

  async getUsers() {
    const { data } = await api.get('/api/admin/users')
    return data
  },

  async updateUser(id, payload) {
    const { data } = await api.put(`/api/admin/users/${id}`, payload)
    return data
  },

  async updateCardStatus(id, status) {
    const { data } = await api.put(`/api/admin/cards/${id}/status`, { status })
    return data
  },

  // Menghapus user tertentu secara permanen berdasarkan ID (Khusus Admin)
  async deleteUser(id) {
    const { data } = await api.delete(`/api/admin/users/${id}`)
    return data
  },
}
