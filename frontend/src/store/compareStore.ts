import { create } from 'zustand';

interface CompareStore {
  ids: number[];
  add: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
}

export const useCompareStore = create<CompareStore>((set) => ({
  ids: [],
  add: (id) =>
    set((s) =>
      s.ids.length < 3 && !s.ids.includes(id)
        ? { ids: [...s.ids, id] }
        : s
    ),
  remove: (id) => set((s) => ({ ids: s.ids.filter((i) => i !== id) })),
  clear: () => set({ ids: [] }),
}));