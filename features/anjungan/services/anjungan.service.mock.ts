import {createApiError, isApiError} from "@/lib/exception";
import {errServiceHandler} from "@/lib/utils";
import type {HttpClientTypes} from "@/types/lib/http-client.type";
import {type Query, QueryDirection} from "@/types/lib/query.type";
import {mockAnjungan} from "@/lib/mock-data/anjungan.mock";
import {AnjunganTypes} from "@/types/features/anjungan.type";
import UpdateAnjunganRequest = AnjunganTypes.Service.UpdateAnjunganRequest;
import CreateAnjunganRequest = AnjunganTypes.Service.CreateAnjunganRequest;
import AnjunganPagination = AnjunganTypes.Service.AnjunganPagination;


// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory storage for demo
let AnjunganData = [...mockAnjungan];

class MockAnjunganService {
  async getAnjungan({
    page,
    itemPerPage,
    sortBy = "createdAt",
    direction = QueryDirection.DESC,
    search = "",
  }: Query.Params): Promise<AnjunganPagination> {
    try {
      // Simulate network delay
      await delay(500);

      // Filter by search
      const filtered = AnjunganData.filter(
        (anjungan) =>
          anjungan.name.toLowerCase().includes(search.toLowerCase()) ||
          anjungan.price.toLowerCase().includes(search.toLowerCase()),
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

  async createAnjungan(
    payload: CreateAnjunganRequest,
  ): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);

      // Check if email exists
      const exists = AnjunganData.find((u) => u.price === payload.price);
      if (exists) {
        throw createApiError(400, "Bad Request", "Data sudah digunakan");
      }

      const newAnjungan: AnjunganTypes.Service.AnjunganData = {
        id: `whn_${Math.random().toString(36).substr(2, 9)}`,
        name: payload.name,
        price: payload.price,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      AnjunganData.unshift(newAnjungan);

      return {
        code: 201,
        status: "Created",
        message: "Data berhasil dibuat",
        data: newAnjungan,
      };
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  async updateAnjungan(
    id: string,
    payload: UpdateAnjunganRequest,
  ): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);

      const index = AnjunganData.findIndex((u) => u.id === id);
      if (index === -1) {
        throw createApiError(404, "Not Found", "Data tidak ditemukan");
      }

      AnjunganData[index] = {
        ...AnjunganData[index],
        ...payload,
      };

      return {
        code: 200,
        status: "OK",
        message: "Data berhasil diperbarui",
        data: AnjunganData[index],
      };
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  async deleteAnjungan(id: string): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);

      const index = AnjunganData.findIndex((u) => u.id === id);
      if (index === -1) {
        throw createApiError(404, "Not Found", "Data tidak ditemukan");
      }

      AnjunganData.splice(index, 1);

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
    AnjunganData = [...mockAnjungan];
  }
}

export default new MockAnjunganService();
