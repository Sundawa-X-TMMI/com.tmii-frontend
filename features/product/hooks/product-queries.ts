import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {onQueryError} from "@/lib/utils";
import type {HttpClientTypes} from "@/types/lib/http-client.type";
import type {Query} from "@/types/lib/query.type";
import ProductService from "@/features/product/services/product.service.mock";
import {ProductTypes} from "@/types/features/product.type";
import UpdateProductRequest = ProductTypes.Service.UpdateProductRequest;
import CreateProductRequest = ProductTypes.Service.CreateProductRequest;

export const productKeys = {
  list: (params: Query.Params) => ["Product", "list", params] as const,
};

export function useProduct(params: Query.Params) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => ProductService.getProduct(params),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductRequest) =>ProductService.createProduct(payload),
    onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
      await queryClient.invalidateQueries({
        queryKey: productKeys.list({
          page: 1,
          itemPerPage: 10,
        }),
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductRequest }) =>
      ProductService.updateProduct(id, payload),
    onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
      await queryClient.invalidateQueries({
        queryKey: productKeys.list({
          page: 1,
          itemPerPage: 10,
        }),
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProductService.deleteProduct(id),
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({
        queryKey: productKeys.list({
          page: 1,
          itemPerPage: 10,
        }),
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}
