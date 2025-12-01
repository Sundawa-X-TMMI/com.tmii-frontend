import { Lens } from '@dhmk/zustand-lens';
import { produce } from 'immer';

export enum UITheme {
    LIGHT = 'light',
    DARK = 'dark'
}

export type UIState = {
    isLoading: boolean;
    theme: UITheme;
    sidebarOpen: boolean;
};

export interface UIActions {
    setLoading: (state: boolean) => void;
    setTheme: (theme: UITheme) => void;
    toggleSidebar: () => void;
    hydrate: () => void;
}

export type UISlice = UIState & UIActions;

export const uiStore: Lens<UISlice> = (set, get) => ({
    isLoading: false,
    theme: UITheme.LIGHT,
    sidebarOpen: true,

    setLoading: (payload: boolean) => {
        set(
            produce((state: UISlice) => {
                state.isLoading = payload;
            })
        );
    },

    setTheme: (theme: UITheme) => {
        set(
            produce((state: UISlice) => {
                state.theme = theme;
            })
        );
    },

    toggleSidebar: () => {
        set(
            produce((state: UISlice) => {
                state.sidebarOpen = !state.sidebarOpen;
            })
        );
    },

    hydrate: () => {
        const { theme, sidebarOpen } = get();

        set(
            produce((state: UISlice) => {
                state.theme = theme;
                state.sidebarOpen = sidebarOpen;
            })
        );
    }
});