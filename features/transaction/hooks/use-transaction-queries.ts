import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import TransactionService from "@/features/transaction/services/transaction.service.mock";
import {onQueryError} from "@/lib/utils";
import {TransactionTypes} from "@/types/features/transaction.type";
import type {HttpClientTypes} from "@/types/lib/http-client.type";
import type {Query} from "@/types/lib/query.type";
import CreateTransactionRequest = TransactionTypes.Service.CreateTransactionRequest;
import UpdateTransactionRequest = TransactionTypes.Service.UpdateTransactionRequest;

export const TransactionKeys = {
  list: (params: Query.Params) => ["Transactions", "list", params] as const,
};

export function useTransactions(params: Query.Params) {
  return useQuery({
    queryKey: TransactionKeys.list(params),
    queryFn: () => TransactionService.getTransactions(params),
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTransactionRequest) => TransactionService.createTransaction(payload),
    onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
      await queryClient.invalidateQueries({
        queryKey: TransactionKeys.list({
          page: 1,
          itemPerPage: 10,
        }),
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTransactionRequest }) =>
      TransactionService.updateTransaction(id, payload),
    onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
      await queryClient.invalidateQueries({
        queryKey: TransactionKeys.list({
          page: 1,
          itemPerPage: 10,
        }),
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TransactionService.deleteTransaction(id),
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({
        queryKey: TransactionKeys.list({
          page: 1,
          itemPerPage: 10,
        }),
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}
