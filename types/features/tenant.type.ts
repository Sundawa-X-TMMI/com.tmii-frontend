import { HttpClientTypes } from '@/types/lib/http-client.type';
import { Query } from '@/types/lib/query.type';

export declare namespace TenantTypes {
  namespace Service {
    interface TenantData {
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
    }

    interface CreateTenantRequest {
      name: string;
    }

    interface UpdateTenantRequest {
      name: string;
    }

    type TenantPagination =
      | HttpClientTypes.Response<Query.Pagination<TenantData>>
      | HttpClientTypes.Response<unknown>;
  }
}