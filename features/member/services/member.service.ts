import {createApiError, isApiError} from "@/lib/exception";
import {Client} from "@/lib/http-client";
import {errServiceHandler} from "@/lib/utils";
import {MemberTypes} from "@/types/features/member.type";
import type {HttpClientTypes} from "@/types/lib/http-client.type";
import {type Query, QueryDirection} from "@/types/lib/query.type";
import MemberPagination = MemberTypes.Service.MemberPagination;
import CreateMemberRequest = MemberTypes.Service.CreateMemberRequest;
import UpdateMemberRequest = MemberTypes.Service.UpdateMemberRequest;

class MemberService {
  async getMembers({
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

      const res = await Client.get<MemberPagination, unknown>(
        `internal/members?${queryParams.toString()}`,
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

  async createMember(payload: CreateMemberRequest) {
    try {
      const res = await Client.post<HttpClientTypes.Response<unknown>, unknown>(
        "internal/members",
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

  async updateMember(id: string, payload: UpdateMemberRequest) {
    try {
      const res = await Client.put<HttpClientTypes.Response<unknown>, unknown>(
        `internal/members/${id}`,
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

  async deleteMember(id: string) {
    try {
      const res = await Client.del<HttpClientTypes.Response<unknown>, unknown>(
        `internal/members/${id}`,
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

export default new MemberService();
