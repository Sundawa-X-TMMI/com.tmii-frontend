import {createApiError, isApiError} from "@/lib/exception";
import {Client} from "@/lib/http-client";
import {errServiceHandler} from "@/lib/utils";
import type {HttpClientTypes} from "@/types/lib/http-client.type";
import {type Query, QueryDirection} from "@/types/lib/query.type";
import CreateWahanaRequest = WahanaTypes.Service.CreateWahanaRequest;
import UpdateWahanaRequest = WahanaTypes.Service.UpdateWahanaRequest;
import {WahanaTypes} from "@/types/features/wahana.type";
import WahanaPagination = WahanaTypes.Service.WahanaPagination;
import {AnjunganTypes} from "@/types/features/anjungan.type";
import AnjunganPagination = AnjunganTypes.Service.AnjunganPagination;
import CreateAnjunganRequest = AnjunganTypes.Service.CreateAnjunganRequest;
import UpdateAnjunganRequest = AnjunganTypes.Service.UpdateAnjunganRequest;

class AnjunganService {
  async getAnjungan({
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

      const res = await Client.get<AnjunganPagination, unknown>(
        `internal/anjungan?${queryParams.toString()}`,
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

  async createAnjungan(payload: CreateAnjunganRequest) {
    try {
      const res = await Client.post<HttpClientTypes.Response<unknown>, unknown>(
        "internal/anjungan",
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

  async updateAnjungan(id: string, payload: UpdateAnjunganRequest) {
    try {
      const res = await Client.put<HttpClientTypes.Response<unknown>, unknown>(
        `internal/anjungan/${id}`,
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

  async deleteAnjungan(id: string) {
    try {
      const res = await Client.del<HttpClientTypes.Response<unknown>, unknown>(
        `internal/anjungan/${id}`,
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

export default new AnjunganService();
