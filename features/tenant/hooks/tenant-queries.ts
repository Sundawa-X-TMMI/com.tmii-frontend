import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {onQueryError} from "@/lib/utils";
import type {HttpClientTypes} from "@/types/lib/http-client.type";
import type {Query} from "@/types/lib/query.type";
import TenantService from "@/features/tenant/services/tenant.service.mock";
import {TenantTypes} from "@/types/features/tenant.type";
import UpdateTenantRequest = TenantTypes.Service.UpdateTenantRequest;
import CreateTenantRequest = TenantTypes.Service.CreateTenantRequest;

export const tenantKeys = {
  list: (params: Query.Params) => ["Tenant", "list", params] as const,
};

export function useTenant(params: Query.Params) {
  return useQuery({
    queryKey: tenantKeys.list(params),
    queryFn: () => TenantService.getTenant(params),
  });
}

export function useCreateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTenantRequest) => TenantService.createTenant(payload),
    onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
      await queryClient.invalidateQueries({
        queryKey: tenantKeys.list({
          page: 1,
          itemPerPage: 10,
        }),
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}

export function useUpdateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTenantRequest }) =>
      TenantService.updateTenant(id, payload),
    onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
      await queryClient.invalidateQueries({
        queryKey: tenantKeys.list({
          page: 1,
          itemPerPage: 10,
        }),
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}

export function useDeleteTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TenantService.deleteTenant(id),
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({
        queryKey: tenantKeys.list({
          page: 1,
          itemPerPage: 10,
        }),
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}
