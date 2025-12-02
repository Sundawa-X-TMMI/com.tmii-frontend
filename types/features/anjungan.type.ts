import { HttpClientTypes } from '@/types/lib/http-client.type';
import { Query } from '@/types/lib/query.type';

export declare namespace AnjunganTypes {
  namespace Service {
    interface AnjunganData {
      id: string;
      name: string;
      price: string;
      createdAt: Date;
      updatedAt: Date;
    }

    interface CreateAnjunganRequest {
      name: string;
      price: string;
    }

    interface UpdateAnjunganRequest {
      name: string;
      price: string;
    }

    type AnjunganPagination =
      | HttpClientTypes.Response<Query.Pagination<AnjunganData>>
      | HttpClientTypes.Response<unknown>;
  }
}