import {createApiError, isApiError} from "@/lib/exception";
import {errServiceHandler} from "@/lib/utils";
import {MemberTypes} from "@/types/features/member.type";
import type {HttpClientTypes} from "@/types/lib/http-client.type";
import {type Query, QueryDirection} from "@/types/lib/query.type";
import MemberPagination = MemberTypes.Service.MemberPagination;
import CreateMemberRequest = MemberTypes.Service.CreateMemberRequest;
import UpdateMemberRequest = MemberTypes.Service.UpdateMemberRequest;
import {mockMembers} from "@/lib/mock-data/members.mock";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory storage for demo
let membersData = [...mockMembers];

class MockMemberService {
  async getMembers({
    page,
    itemPerPage,
    sortBy = "createdAt",
    direction = QueryDirection.DESC,
    search = "",
  }: Query.Params): Promise<MemberPagination> {
    try {
      // Simulate network delay
      await delay(500);

      // Filter by search
      const filtered = membersData.filter(
        (member) =>
          member.name.toLowerCase().includes(search.toLowerCase()) ||
          member.email.toLowerCase().includes(search.toLowerCase()),
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
        message: "Members retrieved successfully",
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

  async createMember(
    payload: CreateMemberRequest,
  ): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);

      // Check if email exists
      const exists = membersData.find((u) => u.email === payload.email);
      if (exists) {
        throw createApiError(400, "Bad Request", "Email sudah digunakan");
      }

      const newMember: MemberTypes.Service.MemberData = {
        id: `usr_${Math.random().toString(36).substr(2, 9)}`,
        name: payload.name,
        email: payload.email,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: null,
      };

      membersData.unshift(newMember);

      return {
        code: 201,
        status: "Created",
        message: "Pengguna berhasil dibuat",
        data: newMember,
      };
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  async updateMember(
    id: string,
    payload: UpdateMemberRequest,
  ): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);

      const index = membersData.findIndex((u) => u.id === id);
      if (index === -1) {
        throw createApiError(404, "Not Found", "Pengguna tidak ditemukan");
      }

      membersData[index] = {
        ...membersData[index],
        ...payload,
      };

      return {
        code: 200,
        status: "OK",
        message: "Pengguna berhasil diperbarui",
        data: membersData[index],
      };

    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  async deleteMember(id: string): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);

      const index = membersData.findIndex((u) => u.id === id);
      if (index === -1) {
        throw createApiError(404, "Not Found", "Pengguna tidak ditemukan");
      }

      membersData.splice(index, 1);

      return {
        code: 200,
        status: "OK",
        message: "Pengguna berhasil dihapus",
      };
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  // Reset data to initial state (useful for demo)
  resetData() {
    membersData = [...mockMembers];
  }
}

export default new MockMemberService();
