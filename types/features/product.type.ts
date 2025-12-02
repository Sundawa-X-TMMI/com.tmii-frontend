import { HttpClientTypes } from '@/types/lib/http-client.type';
import { Query } from '@/types/lib/query.type';

export declare namespace ProductTypes {
  namespace Service {
    interface ProductData {
      id: string;
      merchantName: string;
      productName: string;
      price: number;
      createdAt: Date;
      updatedAt: Date;
    }

    interface CreateProductRequest {
      merchantName: string;
      productName: string;
      price: number;
    }

    interface UpdateProductRequest {
      merchantName: string;
      productName: string;
      price: number;
    }

    type ProductPagination =
      | HttpClientTypes.Response<Query.Pagination<ProductData>>
      | HttpClientTypes.Response<unknown>;
  }
}