// Inisialisasi wadah data kosong (React Context) untuk menyimpan status autentikasi user agar bisa diakses langsung di komponen mana pun tanpa perlu kirim prop manual
import { createContext } from 'react'

export const AuthContext = createContext(null)
