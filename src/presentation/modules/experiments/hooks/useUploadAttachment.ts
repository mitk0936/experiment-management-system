import { useMutation, useQueryClient } from "@tanstack/react-query";
import { APIResponse } from "@/core/types/api";
import { IAttachmentMetaData } from "@/core/entities/Attachment";

type MutationContext = { previousData: IAttachmentMetaData[] | undefined };

export function useAddAttachment() {
  const queryClient = useQueryClient();

  return useMutation<
    IAttachmentMetaData,
    APIResponse<IAttachmentMetaData>,
    { experimentId: string; file: File },
    MutationContext
  >({
    mutationFn: async ({ experimentId, file }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("experimentId", experimentId);

      const res = await fetch("/api/attachment", {
        method: "POST",
        body: formData,
      });

      const responseData: APIResponse<IAttachmentMetaData> = await res.json();

      if (!responseData.success) {
        throw responseData;
      }

      return responseData.data;
    },
    onSuccess: (newAttachment, { experimentId }) => {
      queryClient.setQueryData(
        ["attachments", experimentId],
        (previousData: IAttachmentMetaData[] = []) => [newAttachment, ...previousData],
      );
    },
    onError: (_err, _newAttachment, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["attachments"], context.previousData);
      }
    },
    onSettled: (_, __, { experimentId }) => {
      queryClient.invalidateQueries({ queryKey: ["attachments", experimentId] });
    },
  });
}
