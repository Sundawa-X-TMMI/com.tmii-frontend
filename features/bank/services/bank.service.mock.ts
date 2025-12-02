import {createApiError, isApiError} from "@/lib/exception";
import {errServiceHandler} from "@/lib/utils";
import type {HttpClientTypes} from "@/types/lib/http-client.type";
import {type Query, QueryDirection} from "@/types/lib/query.type";
import {BankTypes} from "@/types/features/bank.type";
import {mockBank} from "@/lib/mock-data/bank.mock";
import UpdateBankRequest = BankTypes.Service.UpdateBankRequest;
import CreateBankRequest = BankTypes.Service.CreateBankRequest;
import BankPagination = BankTypes.Service.BankPagination;


// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory storage for demo
let BankData = [...mockBank];

class MockBankService {
  async getBank({
    page,
    itemPerPage,
    sortBy = "createdAt",
    direction = QueryDirection.DESC,
    search = "",
  }: Query.Params): Promise<BankPagination> {
    try {
      // Simulate network delay
      await delay(500);

      // Filter by search
      const filtered = BankData.filter(
        (bank) =>
          bank.name.toLowerCase().includes(search.toLowerCase()),
      );

      // Sort
      filtered.sort((a, b) => {
        const aVal = a[sortBy as keyof typeof a];
        const bVal = b[sortBy as keyof typeof b];

        if (aVal === null) return 1;
        if (bVal === null) return -1;

        if (direction === QueryDirection.DESC) {
          return aVal > bVal ? -1 : 1;
        }
        return aVal > bVal ? 1 : -1;
      });

      // Paginate
      const start = (page - 1) * itemPerPage;
      const end = start + itemPerPage;
      const items = filtered.slice(start, end);

      return {
        code: 200,
        status: "OK",
        message: "Data retrieved successfully",
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

  async createBank(
    payload: CreateBankRequest,
  ): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);

      const newBank: BankTypes.Service.BankData = {
        id: `whn_${Math.random().toString(36).substr(2, 9)}`,
        name: payload.name,
        accountNumber: Number(payload.accountNumber),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      BankData.unshift(newBank);

      return {
        code: 201,
        status: "Created",
        message: "Data berhasil dibuat",
        data: newBank,
      };
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  async updateBank(
    id: string,
    payload: UpdateBankRequest,
  ): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);

      const index = BankData.findIndex((u) => u.id === id);
      if (index === -1) {
        throw createApiError(404, "Not Found", "Data tidak ditemukan");
      }

      BankData[index] = {
        ...BankData[index],
        name: payload.name?.trim() || BankData[index].name,
        accountNumber: Number(payload.accountNumber) || BankData[index].accountNumber,
        updatedAt: new Date()
      };

      return {
        code: 200,
        status: "OK",
        message: "Data berhasil diperbarui",
        data: BankData[index],
      };
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  async deleteBank(id: string): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);

      const index = BankData.findIndex((u) => u.id === id);
      if (index === -1) {
        throw createApiError(404, "Not Found", "Data tidak ditemukan");
      }

      BankData.splice(index, 1);

      return {
        code: 200,
        status: "OK",
        message: "Data berhasil dihapus",
      };
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  // Reset data to initial state (useful for demo)
  resetData() {
    BankData = [...mockBank];
  }
}

export default new MockBankService();
