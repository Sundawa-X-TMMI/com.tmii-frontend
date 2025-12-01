import axios, {
    AxiosError,
    AxiosInstance,
    AxiosInterceptorManager,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig
} from 'axios';
import { HttpClientTypes } from '@/types/lib/http-client.type';

export class HttpClient {
    private readonly instance: AxiosInstance;
    private isRefreshing: boolean = false;
    private refreshSubscribers: Array<() => void> = [];

    constructor(instance: AxiosInstance) {
        this.instance = instance;
    }

    /**
     * Get Instance of Axios
     * @return {AxiosInstance}
     */
    getInstance(): AxiosInstance {
        return this.instance;
    }

    /**
     * Get Axios interceptors
     * @return {{request: AxiosInterceptorManager<InternalAxiosRequestConfig>, response: AxiosInterceptorManager<AxiosResponse>}}
     */
    getIntercept(): {
        request: AxiosInterceptorManager<InternalAxiosRequestConfig>;
        response: AxiosInterceptorManager<AxiosResponse>;
    } {
        return this.getInstance().interceptors;
    }

    /**
     * Set response log while axios fetching the request.
     * @param res
     * @private
     */
    private responseLog(res: AxiosResponse | AxiosError) {
        const config =
            (res as AxiosResponse)?.config || (res as AxiosError)?.config;
        const responseTime = performance.now();

        console.group(`${config?.method?.toUpperCase()} ${config?.url}`);
        console.table({
            responseTime,
            status:
                (res as AxiosResponse)?.status || (res as AxiosError)?.response?.status,
            message:
                (res as AxiosResponse)?.data?.message || (res as AxiosError)?.message
        });
        console.groupEnd();
    }

    /**
     * authRequestIntercept is used when you use authorization manually.
     * @param token
     */
    authRequestIntercept(token: string | null) {
        this.getIntercept().request.use((cfg) => {
            if (token) cfg.headers.Authorization = `Bearer ${token}`;

            return cfg;
        });
    }

    /**
     * defaultResponseIntercept is pre-define using cookie based and some options refresh token,
     * You can do your own with getIntercept().
     * @param refreshFn
     */
    defaultResponseIntercept(refreshFn?: HttpClientTypes.RefreshFn) {
        this.getIntercept().response.use(
            (res) => {
                if (process.env.NODE_ENV == 'development') this.responseLog(res);

                return res;
            },
            async (err: AxiosError) => {
                const originalRequest = err.config as AxiosRequestConfig & {
                    _retry?: boolean;
                };

                // Take care of excluding your route api to avoid infinite loop while this conditions as matched
                if (
                    err.response?.status == 401 &&
                    !originalRequest._retry &&
                    !originalRequest.url?.includes('/login') &&
                    !originalRequest.url?.includes('/refresh-token') &&
                    refreshFn
                ) {
                    if (!this.isRefreshing) {
                        this.isRefreshing = true;
                        try {
                            await refreshFn();

                            this.refreshSubscribers.forEach((cb) => cb());
                            this.refreshSubscribers = [];
                        } catch (refreshErr) {
                            return Promise.reject(refreshErr);
                        } finally {
                            this.isRefreshing = false;
                        }
                    }

                    return new Promise((resolve) => {
                        this.refreshSubscribers.push(() => {
                            originalRequest._retry = true;
                            resolve(this.instance(originalRequest));
                        });
                    });
                }

                if (process.env.NODE_ENV == 'development') this.responseLog(err);

                return Promise.reject(err);
            }
        );
    }

    /**
     * Create an HTTP Client with pre-configured axios
     * @param options
     * @return {HttpClient}
     */
    static create(options: HttpClientTypes.Options): HttpClient {
        const { refreshFn, ...axiosOptions } = options;

        const instance = axios.create({
            ...axiosOptions
        });

        const client = new HttpClient(instance);
        client.defaultResponseIntercept(refreshFn);

        return client;
    }

    get<T, D>(
        url: string,
        config?: AxiosRequestConfig<D>
    ): Promise<AxiosResponse<T, D>> {
        return this.getInstance().get<T>(url, config ? config : undefined);
    }

    post<T, D>(
        url: string,
        body: D,
        config?: AxiosRequestConfig<D>
    ): Promise<AxiosResponse<T, D>> {
        return this.getInstance().post(url, body, config ? config : undefined);
    }

    put<T, D>(
        url: string,
        body: D,
        config?: AxiosRequestConfig<D>
    ): Promise<AxiosResponse<T, D>> {
        return this.getInstance().put(url, body, config ? config : undefined);
    }

    patch<T, D>(
        url: string,
        body: D,
        config?: AxiosRequestConfig<D>
    ): Promise<AxiosResponse<T, D>> {
        return this.getInstance().patch(url, body, config ? config : undefined);
    }

    del<T, D>(
        url: string,
        config?: AxiosRequestConfig<D>
    ): Promise<AxiosResponse<T, D>> {
        return this.getInstance().delete(url, config ? config : undefined);
    }
}

export const Client = HttpClient.create({
    baseURL:
        process.env.NEXT_PUBLIC_SERVICE_URL || 'http://localhost:4200/api/v1/',
    withCredentials: true
});

export default HttpClient;