import { HttpClientTypes } from '@/types/lib/http-client.type';
import { Query } from '@/types/lib/query.type';

export declare namespace UserTypes {
  namespace Service {
    interface UserData {
      createdAt: Date;
      updatedAt: Date;
      lastLoginAt: Date | null;
      id: string;
      name: string;
      email: string;
    }

    interface CreateUserRequest {
      name: string;
      email: string;
      username: string;
      password: string;
    }

    interface UpdateUserRequest {
      name: string;
    }

    type UserPagination =
      | HttpClientTypes.Response<Query.Pagination<UserData>>
      | HttpClientTypes.Response<unknown>;
  }
}