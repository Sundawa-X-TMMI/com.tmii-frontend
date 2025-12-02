import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {onQueryError} from "@/lib/utils";
import type {HttpClientTypes} from "@/types/lib/http-client.type";
import type {Query} from "@/types/lib/query.type";
import BankService from "@/features/bank/services/bank.service.mock";
import {BankTypes} from "@/types/features/bank.type";
import UpdateBankRequest = BankTypes.Service.UpdateBankRequest;
import CreateBankRequest = BankTypes.Service.CreateBankRequest;

export const bankKeys = {
  list: (params: Query.Params) => ["Bank", "list", params] as const,
};

export function useBank(params: Query.Params) {
  return useQuery({
    queryKey: bankKeys.list(params),
    queryFn: () => BankService.getBank(params),
  });
}

export function useCreateBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBankRequest) => BankService.createBank(payload),
    onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
      await queryClient.invalidateQueries({
        queryKey: bankKeys.list({
          page: 1,
          itemPerPage: 10,
        }),
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}

export function useUpdateBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBankRequest }) =>
      BankService.updateBank(id, payload),
    onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
      await queryClient.invalidateQueries({
        queryKey: bankKeys.list({
          page: 1,
          itemPerPage: 10,
        }),
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}

export function useDeleteBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => BankService.deleteBank(id),
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({
        queryKey: bankKeys.list({
          page: 1,
          itemPerPage: 10,
        }),
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}
