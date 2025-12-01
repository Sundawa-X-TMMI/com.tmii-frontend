import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { HttpClientTypes } from '@/types/lib/http-client.type';
import { AxiosError } from 'axios';
import { ApiErrException, isApiError } from '@/lib/exception';
import { toast } from 'sonner';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function queryRetry(count: number) {
  return (failureCount: number, err: HttpClientTypes.Response<unknown>) => {
    if (err.code === 401 || err.code === 403) {
      return false;
    }

    return failureCount < count;
  };
}

export function errServiceHandler(err: Error): ApiErrException {
  if (typeof err === 'object' && err instanceof AxiosError && err.response) {
    const responseData = err.response.data as HttpClientTypes.Response<unknown>;

    return new ApiErrException(
      responseData?.code || err.response.status,
      responseData?.status || err.response.statusText,
      responseData?.message || err.message
    );
  }

  // For non-Axios errors, create a structured error
  return new ApiErrException(
    500,
    'Internal Server Error',
    process.env.NODE_ENV === 'development'
      ? (err as Error).message
      : 'Oops! Something went wrong'
  );
}

export function onQueryError(err: Error, callback?: () => void) {
  if (isApiError(err)) {
    if (err.isValidationError()) {
      console.log('Validation error details:', err.cause);
    }

    if (err.isAuthError()) {
      console.log('Authentication/Authorization error');

      if (callback) {
        callback();
      }
    } else {
      toast.error(err.message);
    }

    console.log(`Error code: ${err.code}, Status: ${err.status}`);
  } else {
    const errorMessage = err.message || 'Unexpected error occurred';
    toast.error(errorMessage);
  }
}

export function formatCurrency(amount: number, currency: string): string {
  return amount.toLocaleString('id-ID', { style: 'currency', currency });
}