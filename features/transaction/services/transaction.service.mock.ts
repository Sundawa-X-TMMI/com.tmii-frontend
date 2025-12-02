import { createApiError, isApiError } from "@/lib/exception";
import { mockTransactions } from "@/lib/mock-data/transaction.mock";
import { errServiceHandler } from "@/lib/utils";
import { TransactionTypes } from "@/types/features/transaction.type";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import { type Query, QueryDirection } from "@/types/lib/query.type";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory storage for demo
let transactionsData = [...mockTransactions];

class MockTransactionService {
  async getTransactions({
                          page,
                          itemPerPage,
                          sortBy = "date",
                          direction = QueryDirection.DESC,
                          search = "",
                        }: Query.Params): Promise<TransactionTypes.Service.TransactionPagination> {
    try {
      await delay(500);

      // Filter by search
      const filtered = transactionsData.filter(
        (transaction) =>
          (transaction.transactionId?.toLowerCase() || "").includes(
            search.toLowerCase()
          ) ||
          (transaction.merchantId?.toLowerCase() || "").includes(
            search.toLowerCase()
          ) ||
          (transaction.merchantName?.toLowerCase() || "").includes(
            search.toLowerCase()
          ) ||
          (transaction.product?.toLowerCase() || "").includes(
            search.toLowerCase()
          ) ||
          (transaction.status?.toLowerCase() || "").includes(
            search.toLowerCase()
          )
      );

      // Sort
      filtered.sort((a, b) => {
        const aVal = a[sortBy as keyof typeof a];
        const bVal = b[sortBy as keyof typeof b];

        if (aVal === undefined || aVal === null) return 1;
        if (bVal === undefined || bVal === null) return -1;

        if (aVal instanceof Date && bVal instanceof Date) {
          if (direction === QueryDirection.DESC) {
            return bVal.getTime() - aVal.getTime();
          }
          return aVal.getTime() - bVal.getTime();
        }

        if (direction === QueryDirection.DESC) {
          return String(bVal).localeCompare(String(aVal));
        }
        return String(aVal).localeCompare(String(bVal));
      });

      // Paginate
      const start = (page - 1) * itemPerPage;
      const end = start + itemPerPage;
      const items = filtered.slice(start, end);

      return {
        code: 200,
        status: "OK",
        message: "Transactions retrieved successfully",
        data: {
          items,
          count: filtered.length,
          page,
          itemPerPage,
          totalPages: Math.ceil(filtered.length / itemPerPage),
        },
      };
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  async createTransaction(
    payload: TransactionTypes.Service.CreateTransactionRequest
  ): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);

      const exists = transactionsData.find(
        (t) => t.transactionId === payload.transactionId
      );
      if (exists) {
        throw createApiError(
          400,
          "Bad Request",
          "Transaction ID already exists"
        );
      }

      const newTransaction: TransactionTypes.Service.TransactionData = {
        id: `trx_${Math.random().toString(36).substring(2, 11)}`,
        transactionId: payload.transactionId,
        merchantId: payload.merchantId,
        merchantName: payload.merchantName,
        product: payload.product,
        price: payload.price,
        quantity: payload.quantity,
        total: payload.price * payload.quantity,
        date: new Date(),
        status: (payload.status as TransactionTypes.Service.TransactionData['status']) || "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      transactionsData.unshift(newTransaction);

      return {
        code: 201,
        status: "Created",
        message: "Transaction created successfully",
        data: newTransaction,
      };
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  async updateTransaction(
    id: string,
    payload: TransactionTypes.Service.UpdateTransactionRequest
  ): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);

      const index = transactionsData.findIndex((t) => t.id === id);
      if (index === -1) {
        throw createApiError(404, "Not Found", "Transaction not found");
      }

      // @ts-ignore
      transactionsData[index] = <TransactionTypes["Service.TransactionData"]>{
        ...transactionsData[index],
        ...payload,
        updatedAt: new Date(),
      };

      return {
        code: 200,
        status: "OK",
        message: "Transaction updated successfully",
        data: transactionsData[index],
      };
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  async deleteTransaction(
    id: string
  ): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);

      const index = transactionsData.findIndex((t) => t.id === id);
      if (index === -1) {
        throw createApiError(404, "Not Found", "Transaction not found");
      }

      transactionsData.splice(index, 1);

      return {
        code: 200,
        status: "OK",
        message: "Transaction deleted successfully",
      };
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  resetData() {
    transactionsData = [...mockTransactions];
  }
}

export default new MockTransactionService();