import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {onQueryError} from "@/lib/utils";
import type {HttpClientTypes} from "@/types/lib/http-client.type";
import type {Query} from "@/types/lib/query.type";
import WahanaService from "@/features/wahana/services/wahana.service.mock";
import {WahanaTypes} from "@/types/features/wahana.type";
import UpdateWahanaRequest = WahanaTypes.Service.UpdateWahanaRequest;
import CreateWahanaRequest = WahanaTypes.Service.CreateWahanaRequest;

export const wahanaKeys = {
  list: (params: Query.Params) => ["Wahana", "list", params] as const,
};

export function useWahana(params: Query.Params) {
  return useQuery({
    queryKey: wahanaKeys.list(params),
    queryFn: () => WahanaService.getWahana(params),
  });
}

export function useCreateWahana() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWahanaRequest) => WahanaService.createWahana(payload),
    onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
      await queryClient.invalidateQueries({
        queryKey: wahanaKeys.list({
          page: 1,
          itemPerPage: 10,
        }),
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}

export function useUpdateWahana() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateWahanaRequest }) =>
      WahanaService.updateWahana(id, payload),
    onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
      await queryClient.invalidateQueries({
        queryKey: wahanaKeys.list({
          page: 1,
          itemPerPage: 10,
        }),
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}

export function useDeleteWahana() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => WahanaService.deleteWahana(id),
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({
        queryKey: wahanaKeys.list({
          page: 1,
          itemPerPage: 10,
        }),
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}
