import { NextResponse } from "next/server";
import { withAuth } from "../_utils/withAuth";
import { APIResponse } from "@/core/types/api";
import { IAttachmentMetaData } from "@/core/types/entities";
import { MESSAGES } from "@/presentation/constants/messages";
import { AttachmentRepository } from "@/core/repositories/Attachment/AttachmentRepository";
import { logError } from "@/core/utils/logger";

export const GET = withAuth(
  async (req: Request): Promise<NextResponse<APIResponse<IAttachmentMetaData[]>>> => {
    try {
      const { searchParams } = new URL(req.url);
      const experimentId = searchParams.get("experimentId");

      if (!experimentId) {
        return NextResponse.json(
          { success: false, error: MESSAGES.InvalidExperiment },
          { status: 400 },
        );
      }

      const attachments = await AttachmentRepository.getByExperimentId(experimentId);
      const attachmentsMetaData = attachments.map((a) => a.toMetaDataDto());

      return NextResponse.json(
        {
          success: true,
          data: attachmentsMetaData,
        },
        { status: 200 },
      );
    } catch (error) {
      logError("Failed to fetch attachments", error, "GET /api/attachments");

      return NextResponse.json(
        { success: false, error: MESSAGES.AnErrorOccuredTryAgainLater },
        { status: 500 },
      );
    }
  },
);
