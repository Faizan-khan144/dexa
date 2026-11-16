import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Favorite {
  id: number
  name: string
  types: string[]
  addedAt: number
}

interface FavoriteState {
  favorites: Favorite[]
  toggle: (entry: Omit<Favorite, 'addedAt'>) => void
  remove: (id: number) => void
  clear: () => void
  isFavorite: (id: number) => boolean
}

export const useFavorites = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggle: (entry) =>
        set((state) => {
          const exists = state.favorites.some((item) => item.id === entry.id)
          return {
            favorites: exists
              ? state.favorites.filter((item) => item.id !== entry.id)
              : [{ ...entry, addedAt: Date.now() }, ...state.favorites],
          }
        }),

      remove: (id) => set((state) => ({ favorites: state.favorites.filter((item) => item.id !== id) })),

      clear: () => set({ favorites: [] }),

      isFavorite: (id) => get().favorites.some((item) => item.id === id),
    }),
    { name: 'dexa:favorites:v1' },
  ),
)
