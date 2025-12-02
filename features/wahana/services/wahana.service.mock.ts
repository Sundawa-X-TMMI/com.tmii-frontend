import {createApiError, isApiError} from "@/lib/exception";
import {mockWahana} from "@/lib/mock-data/wahana.mock";
import {errServiceHandler} from "@/lib/utils";
import type {HttpClientTypes} from "@/types/lib/http-client.type";
import {type Query, QueryDirection} from "@/types/lib/query.type";
import CreateWahanaRequest = WahanaTypes.Service.CreateWahanaRequest;
import UpdateWahanaRequest = WahanaTypes.Service.UpdateWahanaRequest;
import { WahanaTypes } from "@/types/features/wahana.type";
import WahanaPagination = WahanaTypes.Service.WahanaPagination;


// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory storage for demo
let WahanaData = [...mockWahana];

class MockWahanaService {
  async getWahana({
    page,
    itemPerPage,
    sortBy = "createdAt",
    direction = QueryDirection.DESC,
    search = "",
  }: Query.Params): Promise<WahanaPagination> {
    try {
      // Simulate network delay
      await delay(500);

      // Filter by search
      const filtered = WahanaData.filter(
        (wahana) =>
          wahana.name.toLowerCase().includes(search.toLowerCase()) ||
          wahana.price.toLowerCase().includes(search.toLowerCase()),
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

  async createWahana(
    payload: CreateWahanaRequest,
  ): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);

      // Check if email exists
      const exists = WahanaData.find((u) => u.price === payload.price);
      if (exists) {
        throw createApiError(400, "Bad Request", "Data sudah digunakan");
      }

      const newWahana: WahanaTypes.Service.WahanaData = {
        id: `whn_${Math.random().toString(36).substr(2, 9)}`,
        name: payload.name,
        price: payload.price,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      WahanaData.unshift(newWahana);

      return {
        code: 201,
        status: "Created",
        message: "Data berhasil dibuat",
        data: newWahana,
      };
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  async updateWahana(
    id: string,
    payload: UpdateWahanaRequest,
  ): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);

      const index = WahanaData.findIndex((u) => u.id === id);
      if (index === -1) {
        throw createApiError(404, "Not Found", "Data tidak ditemukan");
      }

      WahanaData[index] = {
        ...WahanaData[index],
        ...payload,
      };

      return {
        code: 200,
        status: "OK",
        message: "Data berhasil diperbarui",
        data: WahanaData[index],
      };
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  async deleteWahana(id: string): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);

      const index = WahanaData.findIndex((u) => u.id === id);
      if (index === -1) {
        throw createApiError(404, "Not Found", "Data tidak ditemukan");
      }

      WahanaData.splice(index, 1);

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
    WahanaData = [...mockWahana];
  }
}

export default new MockWahanaService();
