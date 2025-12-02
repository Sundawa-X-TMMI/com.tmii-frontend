import {createApiError, isApiError} from "@/lib/exception";
import {errServiceHandler} from "@/lib/utils";
import type {HttpClientTypes} from "@/types/lib/http-client.type";
import {type Query, QueryDirection} from "@/types/lib/query.type";
import {TenantTypes} from "@/types/features/tenant.type";
import TenantPagination = TenantTypes.Service.TenantPagination;
import {mockTenant} from "@/lib/mock-data/tenant.mock";
import UpdateTenantRequest = TenantTypes.Service.UpdateTenantRequest;
import CreateTenantRequest = TenantTypes.Service.CreateTenantRequest;


// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory storage for demo
let TenantData = [...mockTenant];

class MockTenantService {
  async getTenant({
    page,
    itemPerPage,
    sortBy = "createdAt",
    direction = QueryDirection.DESC,
    search = "",
  }: Query.Params): Promise<TenantPagination> {
    try {
      // Simulate network delay
      await delay(500);

      // Filter by search
      const filtered = TenantData.filter(
        (tenant) =>
          tenant.name.toLowerCase().includes(search.toLowerCase()),
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

  async createTenant(
    payload: CreateTenantRequest,
  ): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);
      const newTenant: TenantTypes.Service.TenantData = {
        id: `whn_${Math.random().toString(36).substr(2, 9)}`,
        name: payload.name,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      TenantData.unshift(newTenant);

      return {
        code: 201,
        status: "Created",
        message: "Data berhasil dibuat",
        data: newTenant,
      };
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  async updateTenant(
    id: string,
    payload: UpdateTenantRequest,
  ): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);

      const index = TenantData.findIndex((u) => u.id === id);
      if (index === -1) {
        throw createApiError(404, "Not Found", "Data tidak ditemukan");
      }

      TenantData[index] = {
        ...TenantData[index],
        ...payload,
      };

      return {
        code: 200,
        status: "OK",
        message: "Data berhasil diperbarui",
        data: TenantData[index],
      };
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  async deleteTenant(id: string): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);

      const index = TenantData.findIndex((u) => u.id === id);
      if (index === -1) {
        throw createApiError(404, "Not Found", "Data tidak ditemukan");
      }

      TenantData.splice(index, 1);

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
    TenantData = [...mockTenant];
  }
}

export default new MockTenantService();
