export enum QueryDirection {
    DESC = 'DESC',
    ASC = 'ASC'
}

export declare namespace Query {
    interface Params {
        page: number;
        itemPerPage: number;
        sortBy?: string;
        direction?: QueryDirection;
        search?: string;
    }

    interface Pagination<T> {
        items: T[];
        count: number;
    }
}