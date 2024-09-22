import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: false,
  setUser: (user: any) => set({ user }),
}));
