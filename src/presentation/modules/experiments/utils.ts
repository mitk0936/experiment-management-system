import { IAttachmentMetaData } from "@/core/types/entities";

interface DownloadAttachmentOptions {
  onSuccess: () => void;
  onError: (err: string) => void;
}

export async function downloadAttachment(
  attachment: IAttachmentMetaData,
  { onSuccess, onError }: DownloadAttachmentOptions,
) {
  try {
    const response = await fetch(`/api/attachment/${attachment.id}/download`);

    if (!response.ok) {
      onError(`Failed to download file: ${response.statusText}`);
    }

    // Convert response to blob
    const blob = await response.blob();

    // Create an object URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create a temporary anchor element to trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = attachment.filename;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    onSuccess();
  } catch {
    onError("Download failed");
  }
}
