'use client';

import { createContext, ReactNode } from 'react';
import useStore, { UseStoreState } from '@/stores';

const StoreContext = createContext<UseStoreState | null>(null);

interface Props {
    children: ReactNode;
}

export function StoreProvider({ children }: Props) {
    const store = useStore();

    return (
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
}