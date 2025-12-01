export class ApiErrException extends Error {
    public readonly code: number;
    public readonly status: string;
    public readonly isApiError = true;

    constructor(code: number, status: string, message: string) {
        super(message);

        Object.setPrototypeOf(this, ApiErrException.prototype);

        this.name = 'ApiErrException';
        this.code = code;
        this.status = status;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiErrException);
        }
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            status: this.status,
            stack: this.stack
        };
    }

    isValidationError(): boolean {
        return this.code === 422;
    }

    isAuthError(): boolean {
        return this.code === 401 || this.code === 403;
    }

    isServerError(): boolean {
        return this.code >= 500;
    }
}

export function isApiError(error: any): error is ApiErrException {
    return error instanceof ApiErrException || (error && error.isApiError);
}

export function createApiError(
    code: number,
    status: string,
    message: string
): ApiErrException {
    return new ApiErrException(code, status, message);
}