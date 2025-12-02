import { HttpClientTypes } from '@/types/lib/http-client.type';
import { Query } from '@/types/lib/query.type';

export declare namespace BankTypes {
  namespace Service {
    interface BankData {
      id: string;
      name: string;
      accountNumber: number;
      createdAt: Date;
      updatedAt: Date;
    }

    interface CreateBankRequest {
      name: string;
      accountNumber: number;
    }

    interface UpdateBankRequest {
      name: string;
      accountNumber: number;
    }

    type BankPagination =
      | HttpClientTypes.Response<Query.Pagination<BankData>>
      | HttpClientTypes.Response<unknown>;
  }
}