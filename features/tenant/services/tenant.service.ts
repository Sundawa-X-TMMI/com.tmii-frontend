import {createApiError, isApiError} from "@/lib/exception";
import {Client} from "@/lib/http-client";
import {errServiceHandler} from "@/lib/utils";
import type {HttpClientTypes} from "@/types/lib/http-client.type";
import {type Query, QueryDirection} from "@/types/lib/query.type";
import {TenantTypes} from "@/types/features/tenant.type";
import UpdateTenantRequest = TenantTypes.Service.UpdateTenantRequest;
import TenantPagination = TenantTypes.Service.TenantPagination;
import CreateTenantRequest = TenantTypes.Service.CreateTenantRequest;

class TenantService {
  async getTenant({
    page,
    itemPerPage,
    sortBy = "createdAt",
    direction = QueryDirection.DESC,
    search = "",
  }: Query.Params) {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        itemPerPage: itemPerPage.toString(),
        sort: sortBy,
        direction,
        search,
      });

      const res = await Client.get<TenantPagination, unknown>(
        `internal/tenant?${queryParams.toString()}`,
      );

      if (res.data.code >= 400) {
        throw createApiError(
          res.data.code,
          res.data.status || "Error",
          res.data.message || "Request failed",
        );
      }

      return res.data;
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  async createTenant(payload: CreateTenantRequest) {
    try {
      const res = await Client.post<HttpClientTypes.Response<unknown>, unknown>(
        "internal/tenant",
        payload,
      );

      if (res.data.code >= 400) {
        throw createApiError(
          res.data.code,
          res.data.status || "Error",
          res.data.message || "Request failed",
        );
      }

      return res.data;
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  async updateTenant(id: string, payload: UpdateTenantRequest) {
    try {
      const res = await Client.put<HttpClientTypes.Response<unknown>, unknown>(
        `internal/tenant/${id}`,
        payload,
      );

      if (res.data.code >= 400) {
        throw createApiError(
          res.data.code,
          res.data.status || "Error",
          res.data.message || "Request failed",
        );
      }

      return res.data;
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  async deleteTenant(id: string) {
    try {
      const res = await Client.del<HttpClientTypes.Response<unknown>, unknown>(
        `internal/tenant/${id}`,
      );

      if (res.data.code >= 400) {
        throw createApiError(
          res.data.code,
          res.data.status || "Error",
          res.data.message || "Request failed",
        );
      }

      return res.data;
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }
}

export default new TenantService();
