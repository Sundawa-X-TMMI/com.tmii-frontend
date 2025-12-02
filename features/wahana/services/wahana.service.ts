import {createApiError, isApiError} from "@/lib/exception";
import {Client} from "@/lib/http-client";
import {errServiceHandler} from "@/lib/utils";
import type {HttpClientTypes} from "@/types/lib/http-client.type";
import {type Query, QueryDirection} from "@/types/lib/query.type";
import CreateWahanaRequest = WahanaTypes.Service.CreateWahanaRequest;
import UpdateWahanaRequest = WahanaTypes.Service.UpdateWahanaRequest;
import {WahanaTypes} from "@/types/features/wahana.type";
import WahanaPagination = WahanaTypes.Service.WahanaPagination;

class WahanaService {
  async getWahana({
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

      const res = await Client.get<WahanaPagination, unknown>(
        `internal/wahana?${queryParams.toString()}`,
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

  async createWahana(payload: CreateWahanaRequest) {
    try {
      const res = await Client.post<HttpClientTypes.Response<unknown>, unknown>(
        "internal/wahana",
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

  async updateWahana(id: string, payload: UpdateWahanaRequest) {
    try {
      const res = await Client.put<HttpClientTypes.Response<unknown>, unknown>(
        `internal/wahana/${id}`,
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

  async deleteWahana(id: string) {
    try {
      const res = await Client.del<HttpClientTypes.Response<unknown>, unknown>(
        `internal/wahana/${id}`,
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

export default new WahanaService();
