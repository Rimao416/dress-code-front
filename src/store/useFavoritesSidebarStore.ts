// store/useFavoritesSidebarStore.ts
import { create } from 'zustand';

interface FavoritesSidebarState {
  isOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

export const useFavoritesSidebarStore = create<FavoritesSidebarState>((set) => ({
  isOpen: false,
  openSidebar: () => set({ isOpen: true }),
  closeSidebar: () => set({ isOpen: false }),
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
}));