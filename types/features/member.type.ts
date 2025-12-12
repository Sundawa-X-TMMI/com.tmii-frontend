import { HttpClientTypes } from '@/types/lib/http-client.type';
import { Query } from '@/types/lib/query.type';

export declare namespace MemberTypes {
  namespace Service {
    interface MemberData {
      createdAt: Date;
      updatedAt: Date;
      lastLoginAt: Date | null;
      id: string;
      name: string;
      email: string;
    }

    interface CreateMemberRequest {
      name: string;
      email: string;
      username: string;
      password: string;
    }

    interface UpdateMemberRequest {
      name: string;
    }

    type MemberPagination =
      | HttpClientTypes.Response<Query.Pagination<MemberData>>
      | HttpClientTypes.Response<unknown>;
  }
}