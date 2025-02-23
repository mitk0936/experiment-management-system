"use client";

import { IExperiment } from "@/core/entities/Experiment";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/common/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAttachments } from "../hooks/useAttachments";
import { formatUserLocaleDate } from "@/presentation/common/lib/date";
import { Button } from "@/presentation/common/components/ui/button";
import { useCallback } from "react";
import { IAttachmentMetaData } from "@/core/entities/Attachment";
import { downloadAttachment } from "../utils";
import { toast } from "sonner";

export function ViewExperimentDetails({ experiment }: { experiment: IExperiment }) {
  const { data = [], isLoading, error } = useAttachments(experiment.id);

  const handleDownload = useCallback((attachment: IAttachmentMetaData) => {
    downloadAttachment(attachment, {
      onSuccess: () => toast.success(`Download completed for ${attachment.filename}`),
      onError: () => toast.error("Failed to download attachment."),
    });
  }, []);

  return (
    <div className="space-y-4">
      {/* Experiment Details */}
      <Card>
        <CardHeader>
          <CardTitle>{experiment.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Field:</strong> {experiment.field}
          </p>
          <p>
            <strong>Status:</strong> {experiment.status}
          </p>
          {experiment.description && (
            <p>
              <strong>Description:</strong> {experiment.description}
            </p>
          )}
          <p>
            <strong>Created:</strong> {formatUserLocaleDate(experiment.dateCreated)}
          </p>
        </CardContent>
      </Card>

      {/* Attachments */}
      <Card>
        <CardHeader>
          <CardTitle>Attachments</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="animate-spin text-gray-500" size={20} />
              <p className="text-gray-500">Loading attachments...</p>
            </div>
          ) : error ? (
            <p className="text-red-500">Failed to load attachments.</p>
          ) : data.length === 0 ? (
            <p className="text-gray-500">No attachments found.</p>
          ) : (
            <ul className="space-y-2">
              {data.map((attachment) => (
                <li
                  key={attachment.id}
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <a
                    onClick={(e) => {
                      handleDownload(attachment);
                      e.preventDefault();
                    }}
                    className="text-blue-500 hover:underline cursor-pointer"
                  >
                    {attachment.filename}
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    onClick={() => handleDownload(attachment)}
                  >
                    Download
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
