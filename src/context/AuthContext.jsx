// Pengatur Sesi Autentikasi (Auth Context Provider). Mengatur status login, logout, daftar, dan pembaruan profil user secara global di seluruh bagian aplikasi.
import { useMemo, useState } from 'react'
import { AuthContext } from './auth-context'
import { authService, userService } from '../services/api'

// Fungsi pembantu untuk mengambil data sesi user yang tersimpan di browser saat web pertama kali dibuka
function getSavedSession() {
  const savedToken = localStorage.getItem('lokerku_token') || sessionStorage.getItem('lokerku_token')
  const savedUser = localStorage.getItem('lokerku_user') || sessionStorage.getItem('lokerku_user')

// buat ngebersiin data yg ga lengkap data dummy
  if (!savedToken || !savedUser || savedToken.startsWith('mock-jwt')) {
    localStorage.removeItem('lokerku_token')
    localStorage.removeItem('lokerku_user')
    sessionStorage.removeItem('lokerku_token')
    sessionStorage.removeItem('lokerku_user')
    return { token: null, user: null }
  }

  try {
    return { token: savedToken, user: JSON.parse(savedUser) }
  } catch {
    // kalo json nya rusak, dia bakal ngebersihin data yg rusak itu
    localStorage.removeItem('lokerku_token')
    localStorage.removeItem('lokerku_user')
    sessionStorage.removeItem('lokerku_token')
    sessionStorage.removeItem('lokerku_user')
    return { token: null, user: null }
  }
}

export function AuthProvider({ children }) {
  // Simpan data sesi (token & data diri) ke dalam state lokal
  const [session, setSession] = useState(getSavedSession)

  // buat login ke webnya
  async function login(payload, remember = false) {
    const result = await authService.login(payload)
    setSession({ token: result.token, user: result.user })

    // logic kalau mencet inget saya dicentang disimpan di localStorage biar awet, jika tidak disimpan di sessionStorage biar langsung hilang pas tab ditutup
    if (remember) {
      localStorage.setItem('lokerku_token', result.token)
      localStorage.setItem('lokerku_user', JSON.stringify(result.user))
      sessionStorage.removeItem('lokerku_token')
      sessionStorage.removeItem('lokerku_user')
    } else {
      sessionStorage.setItem('lokerku_token', result.token)
      sessionStorage.setItem('lokerku_user', JSON.stringify(result.user))
      localStorage.removeItem('lokerku_token')
      localStorage.removeItem('lokerku_user')
    }
    return result.user
  }

  // buat ngedaftarin akun baru
  async function register(payload) {
    const result = await authService.register(payload)
    setSession({ token: result.token, user: result.user })

    // biar si data nya di simpen di sessionstorage biar ga ilang
    sessionStorage.setItem('lokerku_token', result.token)
    sessionStorage.setItem('lokerku_user', JSON.stringify(result.user))
    localStorage.removeItem('lokerku_token')
    localStorage.removeItem('lokerku_user')
    return result.user
  }

  // buat logout dan ngebersihin data sesi di brosernya
  function logout() {
    setSession({ token: null, user: null })
    localStorage.removeItem('lokerku_token')
    localStorage.removeItem('lokerku_user')
    sessionStorage.removeItem('lokerku_token')
    sessionStorage.removeItem('lokerku_user')
  }

  // buat ngirim data profile yg uda di apdet ke be nya
  async function updateProfile(payload) {
    const result = await userService.updateProfile(payload)
    const updatedUser = result.user || result
    updateUserState(updatedUser) // ngejalanin state local biar ke apdet 
    return updatedUser
  }

  
  function updateUserState(newData) {
    setSession((currentSession) => {
      const updatedUser = { ...currentSession.user, ...newData }
      // nyimpen perubahan ke wadah yang sesuai localStorage atau sessionStorage
      if (localStorage.getItem('lokerku_token')) {
        localStorage.setItem('lokerku_user', JSON.stringify(updatedUser))
      } else {
        sessionStorage.setItem('lokerku_user', JSON.stringify(updatedUser))
      }
      return { ...currentSession, user: updatedUser }
    })
  }

  // ngebungkus fungsi autentikasi ke 1 objek biar ga berubah
  const value = useMemo(
    () => ({
      user: session.user,
      token: session.token,
      loading: false,
      isAuthenticated: Boolean(session.token),
      login,
      register,
      updateProfile,
      updateUserState,
      logout,
    }),
    [session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
