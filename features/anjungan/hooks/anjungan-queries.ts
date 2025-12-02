import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {onQueryError} from "@/lib/utils";
import type {HttpClientTypes} from "@/types/lib/http-client.type";
import type {Query} from "@/types/lib/query.type";
import AnjunganService from "@/features/anjungan/services/anjungan.service.mock";
import {AnjunganTypes} from "@/types/features/anjungan.type";
import CreateAnjunganRequest = AnjunganTypes.Service.CreateAnjunganRequest;
import UpdateAnjunganRequest = AnjunganTypes.Service.UpdateAnjunganRequest;

export const anjunganKeys = {
  list: (params: Query.Params) => ["Anjungan", "list", params] as const,
};

export function useAnjungan(params: Query.Params) {
  return useQuery({
    queryKey: anjunganKeys.list(params),
    queryFn: () => AnjunganService.getAnjungan(params),
  });
}

export function useCreateAnjungan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAnjunganRequest) => AnjunganService.createAnjungan(payload),
    onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
      await queryClient.invalidateQueries({
        queryKey: anjunganKeys.list({
          page: 1,
          itemPerPage: 10,
        }),
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}

export function useUpdateAnjungan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAnjunganRequest }) =>
      AnjunganService.updateAnjungan(id, payload),
    onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
      await queryClient.invalidateQueries({
        queryKey: anjunganKeys.list({
          page: 1,
          itemPerPage: 10,
        }),
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}

export function useDeleteAnjungan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AnjunganService.deleteAnjungan(id),
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({
        queryKey: anjunganKeys.list({
          page: 1,
          itemPerPage: 10,
        }),
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}
