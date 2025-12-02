import {createApiError, isApiError} from "@/lib/exception";
import {mockUsers} from "@/lib/mock-data/users.mock";
import {errServiceHandler} from "@/lib/utils";
import {UserTypes} from "@/types/features/user.type";
import type {HttpClientTypes} from "@/types/lib/http-client.type";
import {type Query, QueryDirection} from "@/types/lib/query.type";
import UserPagination = UserTypes.Service.UserPagination;
import CreateUserRequest = UserTypes.Service.CreateUserRequest;
import UpdateUserRequest = UserTypes.Service.UpdateUserRequest;

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory storage for demo
let usersData = [...mockUsers];

class MockUserService {
  async getUsers({
    page,
    itemPerPage,
    sortBy = "createdAt",
    direction = QueryDirection.DESC,
    search = "",
  }: Query.Params): Promise<UserPagination> {
    try {
      // Simulate network delay
      await delay(500);

      // Filter by search
      const filtered = usersData.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()),
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
        message: "Users retrieved successfully",
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

  async createUser(
    payload: CreateUserRequest,
  ): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);

      // Check if email exists
      const exists = usersData.find((u) => u.email === payload.email);
      if (exists) {
        throw createApiError(400, "Bad Request", "Email sudah digunakan");
      }

      const newUser: UserTypes.Service.UserData = {
        id: `usr_${Math.random().toString(36).substr(2, 9)}`,
        name: payload.name,
        email: payload.email,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: null,
      };

      usersData.unshift(newUser);

      return {
        code: 201,
        status: "Created",
        message: "Pengguna berhasil dibuat",
        data: newUser,
      };
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  async updateUser(
    id: string,
    payload: UpdateUserRequest,
  ): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);

      const index = usersData.findIndex((u) => u.id === id);
      if (index === -1) {
        throw createApiError(404, "Not Found", "Pengguna tidak ditemukan");
      }

      usersData[index] = {
        ...usersData[index],
        ...payload,
      };

      return {
        code: 200,
        status: "OK",
        message: "Pengguna berhasil diperbarui",
        data: usersData[index],
      };
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  async deleteUser(id: string): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);

      const index = usersData.findIndex((u) => u.id === id);
      if (index === -1) {
        throw createApiError(404, "Not Found", "Pengguna tidak ditemukan");
      }

      usersData.splice(index, 1);

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
    usersData = [...mockUsers];
  }
}

export default new MockUserService();
