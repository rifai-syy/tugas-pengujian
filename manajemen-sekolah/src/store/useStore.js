import { create } from 'zustand';

const useStore = create((set) => ({
  // Ambil data awal dari localStorage 'user'
  authUser: JSON.parse(localStorage.getItem('user')) || null,

  setAuthUser: (user) => {
    // 1. Simpan ke RAM
    set({ authUser: user });
    
    // 2. Simpan ke LocalStorage (Gunakan kunci 'user' secara konsisten)
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  },

  logout: () => {
    set({ authUser: null });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Tambahkan reload agar memori benar-benar bersih
    window.location.href = "/login";
  }
}));

export default useStore;