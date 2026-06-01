import { create } from 'zustand'

export const useBookingStore = create((set) => ({
  selectedLocation: null, 
  selectedSize: 'sedang', 
  duration: 1,            // sewa def ny 1 hri
  lastBooking: null,      // nyimpn dta trkhir book
  
  setLocation: (location) => set({ selectedLocation: location }),
  setSize: (size) => set({ selectedSize: size }), 
  increaseDuration: () => set((state) => ({ duration: state.duration + 1 })),
  decreaseDuration: () => set((state) => ({ duration: Math.max(1, state.duration - 1) })),//durasi minimal 1 hari
  setLastBooking: (booking) => set({ lastBooking: booking }),
  resetBooking: () => set({ selectedLocation: null, selectedSize: 'sedang', duration: 1 }),
  // reset pilihan sewa ke default
}))


