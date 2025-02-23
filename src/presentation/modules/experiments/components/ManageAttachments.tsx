"use client";

import { useCallback, useState } from "react";
import { useAddAttachment } from "@/presentation/modules/experiments/hooks/useUploadAttachment";
import { Button } from "@/presentation/common/components/ui/button";
import { Input } from "@/presentation/common/components/ui/input";
import { toast } from "sonner";
import { MESSAGES } from "@/presentation/constants/messages";
import { FormError } from "@/presentation/common/components/composite/FormError";
import { useAttachments } from "../hooks/useAttachments";
import { Download, Loader2, Trash2 } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { ConfirmDialog } from "@/presentation/common/components/composite/ConfirmDialog";
import { useDeleteAttachment } from "../hooks/useDeleteAttachment";

export function ManageAttachments({ experimentId }: { experimentId: string }) {
  const [fileInputError, setFileInputError] = useState(MESSAGES.Empty);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [requestedToDeleteItemId, setRequestedToDeleteItemId] = useState<string | null>(null);

  const { mutate: uploadAttachment, isPending: isUploading } = useAddAttachment();
  const { mutate: deleteAttachment, isPending: isDeleting } = useDeleteAttachment(experimentId);

  const {
    data: attachments = [],
    isLoading: isLoadingAttachments,
    error,
  } = useAttachments(experimentId);

  const isProcessingRequests = Boolean(isLoadingAttachments || isDeleting || isUploading);

  const handleUpload = useCallback(() => {
    if (!selectedFile) {
      setFileInputError(MESSAGES.NoFileIsAttached);
      return;
    }

    uploadAttachment(
      { experimentId, file: selectedFile },
      {
        onSuccess: () => {
          toast.success("File uploaded successfully!");
          setSelectedFile(null);
        },
        onError: () => {
          toast.error("Upload failed.");
        },
      },
    );
  }, [experimentId, selectedFile, uploadAttachment]);

  return (
    <div className="space-y-4 relative">
      {/* Confirm Delete Attachment Dialog */}
      <ConfirmDialog
        open={Boolean(requestedToDeleteItemId)}
        onOpenChange={() => setRequestedToDeleteItemId(null)}
        onConfirm={() => {
          if (!requestedToDeleteItemId) {
            toast.error("An error occured.");
            return;
          }

          deleteAttachment(
            { attachmentId: requestedToDeleteItemId },
            {
              onSuccess: () => {
                toast.success("Attachment was deleted.");
              },
              onError: () => {
                toast.error("Failed to delete experiment.");
              },
            },
          );
        }}
      />
      {isProcessingRequests && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm z-10">
          <Loader2 className="animate-spin" size={40} />
        </div>
      )}
      <ul className="space-y-2">
        {attachments.length === 0 ? (
          <p className="text-gray-500">No attachments found.</p>
        ) : (
          attachments.map((attachment) => (
            <li
              key={attachment.id}
              className="flex items-center justify-between p-2 border rounded-md"
            >
              <a
                href={`/api/attachments/${attachment.id}/download`}
                className="text-blue-500 hover:underline"
              >
                {attachment.filename}
              </a>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setRequestedToDeleteItemId(attachment.id);
                  }}
                >
                  <Trash2 />
                </Button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* Upload Form */}
      <Separator />
      <div className="my-2">
        <label className="block py-2">Add New Attachment</label>
        <div className="flex items-center space-x-2">
          <Input
            name="attachment-upload"
            max={1}
            type="file"
            accept=".csv"
            onChange={(e) => {
              setSelectedFile(e.target.files?.[0] || null);
              setFileInputError(MESSAGES.Empty);
            }}
          />
          <Button onClick={handleUpload} disabled={!selectedFile}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
        <FormError message={fileInputError} />
      </div>
    </div>
  );
}
