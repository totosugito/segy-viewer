import {create} from "zustand/index";
import {APP_CONFIG} from "@/constants/config";
import {persist} from "zustand/middleware";

export const defaultStore = {

}

type Store = {
  resetAll: () => void;
}

export const useAppStore = create<Store>()(
  persist(
    (set) => ({

      resetAll: () => set({
      }),
    }),
    {
      name: `${APP_CONFIG.prefixStore}-app`, // single storage key
    }
  )
);