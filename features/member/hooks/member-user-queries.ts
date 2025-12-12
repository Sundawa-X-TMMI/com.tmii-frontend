import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import MemberService from "@/features/member/services/member.service.mock";
import {onQueryError} from "@/lib/utils";
import {MemberTypes} from "@/types/features/member.type";
import type {HttpClientTypes} from "@/types/lib/http-client.type";
import type {Query} from "@/types/lib/query.type";
import CreateMemberRequest = MemberTypes.Service.CreateMemberRequest;
import UpdateMemberRequest = MemberTypes.Service.UpdateMemberRequest;

export const memberKeys = {
  list: (params: Query.Params) => ["Members", "list", params] as const,
};

export function useMembers(params: Query.Params) {
  return useQuery({
    queryKey: memberKeys.list(params),
    queryFn: () => MemberService.getMembers(params),
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMemberRequest) => MemberService.createMember(payload),
    onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
      await queryClient.invalidateQueries({
        queryKey: memberKeys.list({
          page: 1,
          itemPerPage: 10,
        }),
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}

export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateMemberRequest }) =>
      MemberService.updateMember(id, payload),
    onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
      await queryClient.invalidateQueries({
        queryKey: memberKeys.list({
          page: 1,
          itemPerPage: 10,
        }),
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => MemberService.deleteMember(id),
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({
        queryKey: memberKeys.list({
          page: 1,
          itemPerPage: 10,
        }),
      });
      toast.success(res.message);
    },
    onError: (err) => onQueryError(err),
  });
}
