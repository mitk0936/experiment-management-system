import { NextResponse } from "next/server";
import { MESSAGES } from "@/presentation/constants/messages";
import { logError } from "@/core/utils/logger";
import ExperimentRepository from "@/core/repositories/Experiment/ExperimentRepository";
import { APIErrorResponse, APIResponse } from "@/core/types/api";
import { withAuth } from "../../auth/_utils/with-auth";
import { AccessControlService } from "@/core/services/AccessControlService";

export const DELETE = withAuth<null>(async function (
  req: Request,
  sessionUser,
): Promise<NextResponse<APIResponse<null>>> {
  try {
    const url = new URL(req.url);
    // Extract ID from URL, TODO, maybe find a better way to do it
    const experimentId = url.pathname.split("/").pop();

    if (!experimentId) {
      return NextResponse.json<APIErrorResponse>(
        { success: false, error: MESSAGES.InvalidExperiment },
        { status: 400 },
      );
    }

    // Ensure the experiment exists before deleting it
    const experiment = await ExperimentRepository.getById(experimentId);

    if (!experiment) {
      return NextResponse.json<APIErrorResponse>(
        { success: false, error: MESSAGES.ExperimentNotFound },
        { status: 404 },
      );
    }

    const userAuthroizedForExperiment = await AccessControlService.isUserAuthorizedForExperiment(
      sessionUser?.id,
      experimentId,
    );

    if (!userAuthroizedForExperiment) {
      return NextResponse.json<APIErrorResponse>(
        { success: false, error: "Unauthorized to delete this experiment" },
        { status: 403 },
      );
    }

    await ExperimentRepository.delete(experimentId);

    return NextResponse.json({ success: true, data: null }, { status: 200 });
  } catch (error) {
    logError("ISE when trying to delete an experiment", error, "DELETE /api/experiment/:id");

    return NextResponse.json<APIErrorResponse>(
      { success: false, error: MESSAGES.AnErrorOccuredTryAgainLater },
      { status: 500 },
    );
  }
});
