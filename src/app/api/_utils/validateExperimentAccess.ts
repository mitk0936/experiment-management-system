import { NextResponse } from "next/server";
import { AccessControlService } from "@/core/services/AccessControlService";
import { APIErrorResponse } from "@/core/types/api";
import { MESSAGES } from "@/presentation/constants/messages";
import { ExperimentRepository } from "@/core/repositories/Experiment/ExperimentRepository";

export async function validateExperimentAccess(experimentId: string | undefined, userId: string) {
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
    userId,
    experimentId,
  );

  if (!userAuthorizedForExperiment) {
    return NextResponse.json<APIErrorResponse>(
      { success: false, error: MESSAGES.AccessForbidden },
      { status: 403 },
    );
  }

  return { experiment };
}
