import {createApiError, isApiError} from "@/lib/exception";
import {errServiceHandler} from "@/lib/utils";
import type {HttpClientTypes} from "@/types/lib/http-client.type";
import {type Query, QueryDirection} from "@/types/lib/query.type";
import {mockProduct} from "@/lib/mock-data/product.mock";
import {ProductTypes} from "@/types/features/product.type";
import UpdateProductRequest = ProductTypes.Service.UpdateProductRequest;
import CreateProductRequest = ProductTypes.Service.CreateProductRequest;
import ProductPagination = ProductTypes.Service.ProductPagination;


// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory storage for demo
let ProductData = [...mockProduct];

class MockProductService {
  async getProduct({
    page,
    itemPerPage,
    sortBy = "createdAt",
    direction = QueryDirection.DESC,
    search = "",
  }: Query.Params): Promise<ProductPagination> {
    try {
      // Simulate network delay
      await delay(500);

      // Filter by search
      const filtered = ProductData.filter(
        (product) =>
          product.merchantName.toLowerCase().includes(search.toLowerCase()) ||
          product.productName.toLowerCase().includes(search.toLowerCase()),
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

  async createProduct(
    payload: CreateProductRequest,
  ): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);

      // Check if email exists
      const exists = ProductData.find((u) => u.price === payload.price);
      if (exists) {
        throw createApiError(400, "Bad Request", "Data sudah digunakan");
      }

      const newProduct: ProductTypes.Service.ProductData = {
        id: `whn_${Math.random().toString(36).substr(2, 9)}`,
        merchantName: payload.merchantName,
        productName: payload.productName,
        price: payload.price,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      ProductData.unshift(newProduct);

      return {
        code: 201,
        status: "Created",
        message: "Data berhasil dibuat",
        data: newProduct,
      };
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  async updateProduct(
    id: string,
    payload: UpdateProductRequest,
  ): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);

      const index = ProductData.findIndex((u) => u.id === id);
      if (index === -1) {
        throw createApiError(404, "Not Found", "Data tidak ditemukan");
      }

      ProductData[index] = {
        ...ProductData[index],
        ...payload,
      };

      return {
        code: 200,
        status: "OK",
        message: "Data berhasil diperbarui",
        data: ProductData[index],
      };
    } catch (err) {
      if (isApiError(err)) throw err;
      throw errServiceHandler(err as Error);
    }
  }

  async deleteProduct(id: string): Promise<HttpClientTypes.Response<unknown>> {
    try {
      await delay(300);

      const index = ProductData.findIndex((u) => u.id === id);
      if (index === -1) {
        throw createApiError(404, "Not Found", "Data tidak ditemukan");
      }

      ProductData.splice(index, 1);

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
    ProductData = [...mockProduct];
  }
}

export default new MockProductService();
