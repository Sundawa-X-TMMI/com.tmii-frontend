import { CreateAxiosDefaults } from 'axios';

export declare namespace HttpClientTypes {
    type RefreshFn = () => Promise<void>;

    interface Options extends CreateAxiosDefaults {
        refreshFn?: RefreshFn;
    }

    interface Response<T> {
        code: number;
        status: string;
        message: string;
        data?: T;
        errors?: Record<string, string[]>;
    }
}