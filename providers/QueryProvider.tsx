'use client';

import {
    MutationCache,
    QueryCache,
    QueryClient,
    QueryClientProvider
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';
import { isApiError } from '@/lib/exception';
import { toast } from 'sonner';

interface Props {
    children: ReactNode;
}

const getErrorStatus = (error: any): number | null => {
    if (isApiError(error)) return error.code;
    if (error?.response?.status) return error.response.status;
    if (error?.response?.data?.code) return error.response.data.code;
    if (error?.status) return error.status;
    if (typeof error?.code === 'number') return error.code;
    return null;
};

export function QueryProvider({ children }: Props) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                queryCache: new QueryCache({
                    onError: (error: any) => {
                        const status = getErrorStatus(error);
                        if (status === 401 || status === 403) {
                            return;
                        } else {
                            if (isApiError(error)) {
                                toast.error(error.message);
                            } else {
                                toast.error((error as Error)?.message ?? 'Unknown error');
                            }
                        }
                    }
                }),
                mutationCache: new MutationCache({
                    onError: (error: any) => {
                        const status = getErrorStatus(error);
                        if (status === 401 || status === 403) {
                            return;
                        } else {
                            if (isApiError(error)) {
                                toast.error(error.message);
                            } else {
                                toast.error((error as Error)?.message ?? 'Unknown error');
                            }
                        }
                    }
                }),
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        gcTime: 5 * 60 * 1000,
                        retry: (failureCount, error: any) => {
                            const status = getErrorStatus(error);
                            if (
                                status &&
                                status >= 400 &&
                                status < 500 &&
                                ![408, 429].includes(status)
                            ) {
                                return false;
                            }
                            return failureCount < 2;
                        },
                        throwOnError: () => false
                    },
                    mutations: {
                        retry: () => false,
                        throwOnError: () => false
                    }
                }
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}