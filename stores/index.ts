import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { lens, withLenses, persistOptions } from '@dhmk/zustand-lens';
import { UISlice, uiStore } from '@/stores/ui.store';

type StoreState = {
    ui: UISlice;
};

export type UseStoreState = ReturnType<typeof useStore>;

const useStore = create<StoreState>()(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (process.env.NODE_ENV === 'development' ? devtools : (fn: any) => fn)(
        persist(
            immer(
                withLenses<StoreState>({
                    ui: lens<UISlice>(uiStore),
                })
            ),
            {
                name: 'app-storage',
                ...persistOptions,
                partialize: (state) => {
                    console.log('Global partialize - full state:', state);
                    return {
                        ui: state.ui,
                        auth: state.auth
                    };
                }
            }
        ),
        {
            name: 'app-store'
        }
    )
);

export default useStore;