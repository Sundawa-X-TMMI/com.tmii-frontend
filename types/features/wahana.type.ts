import { HttpClientTypes } from '@/types/lib/http-client.type';
import { Query } from '@/types/lib/query.type';

export declare namespace WahanaTypes {
  namespace Service {
    interface WahanaData {
      id: string;
      name: string;
      price: string;
      createdAt: Date;
      updatedAt: Date;
    }

    interface CreateWahanaRequest {
      name: string;
      price: string;
    }

    interface UpdateWahanaRequest {
      name: string;
      price: string;
    }

    type WahanaPagination =
      | HttpClientTypes.Response<Query.Pagination<WahanaData>>
      | HttpClientTypes.Response<unknown>;
  }
}