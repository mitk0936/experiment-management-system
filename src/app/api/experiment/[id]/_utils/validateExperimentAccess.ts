import { NextResponse } from "next/server";
import { AccessControlService } from "@/core/services/AccessControlService";
import { APIErrorResponse } from "@/core/types/api";
import { MESSAGES } from "@/presentation/constants/messages";
import ExperimentRepository from "@/core/repositories/Experiment/ExperimentRepository";

export async function validateExperimentAccess(req: Request, sessionUser: { id: string }) {
  const url = new URL(req.url);
  // Extract ID from URL, TODO, maybe find a better way to do it
  const experimentId = url.pathname.split("/").pop();

  if (!experimentId) {
    return NextResponse.json<APIErrorResponse>(
      { success: false, error: MESSAGES.InvalidExperiment },
      { status: 400 },
    );
  }

  const experiment = await ExperimentRepository.getById(experimentId);

  if (!experiment) {
    return NextResponse.json<APIErrorResponse>(
      { success: false, error: MESSAGES.ExperimentNotFound },
      { status: 404 },
    );
  }

  const userAuthorizedForExperiment = await AccessControlService.isUserAuthorizedForExperiment(
    sessionUser?.id,
    experimentId,
  );

  if (!userAuthorizedForExperiment) {
    return NextResponse.json<APIErrorResponse>(
      { success: false, error: MESSAGES.AccessForbidden },
      { status: 403 },
    );
  }

  return { experimentId, experiment };
}
