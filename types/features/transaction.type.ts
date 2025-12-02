type TransactionStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed';

import { HttpClientTypes } from '@/types/lib/http-client.type';
import { Query } from '@/types/lib/query.type';

export declare namespace TransactionTypes {
  namespace Service {
    interface TransactionData {
      id: string;
      transactionId: string;
      merchantId: string;
      merchantName: string;
      product: string;
      price: number;
      quantity: number;
      total: number;
      date: Date;
      status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed';
      createdAt: Date;
      updatedAt: Date;
    }

    interface CreateTransactionRequest {
      transactionId: string;
      merchantId: string;
      merchantName: string;
      product: string;
      price: number;
      quantity: number;
      status: string;
    }

    interface UpdateTransactionRequest {
      status: string;
    }

    type TransactionPagination =
      | HttpClientTypes.Response<Query.Pagination<TransactionData>>
      | HttpClientTypes.Response<unknown>;
  }
}