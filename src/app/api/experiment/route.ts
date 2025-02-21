"use server";

import { NextResponse } from "next/server";
import { MESSAGES } from "@/presentation/constants/messages";
import { logError } from "@/core/utils/logger";
import { addExperimentSchema } from "@/core/validation/add-experiment/schema";
import ExperimentRepository from "@/core/repositories/Experiment/ExperimentRepository";
import { extractZodErrors } from "@/core/validation/utils";
import { APIErrorResponse, APIResponse } from "@/core/types/api";
import { Experiment, IExperiment } from "@/core/entities/Experiment";
import { User } from "@/core/entities/User";
import { withAuth } from "../auth/_utils/with-auth";

export const GET = withAuth<IExperiment[]>(async function (): Promise<
  NextResponse<APIResponse<IExperiment[]>>
> {
  try {
    const experiments = await ExperimentRepository.getAll();
    return NextResponse.json({ success: true, data: experiments }, { status: 200 });
  } catch (error) {
    logError("ISE when trying to fetch experiments", error, "GET /api/experiment");
    return NextResponse.json<APIErrorResponse>(
      { success: false, error: MESSAGES.AnErrorOccuredTryAgainLater },
      { status: 500 },
    );
  }
});

export const POST = withAuth<IExperiment>(async function (
  req: Request,
): Promise<NextResponse<APIResponse<IExperiment>>> {
  try {
    const body = await req.json();
    const validation = addExperimentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<APIErrorResponse>(
        { success: false, fieldErrors: extractZodErrors(validation) },
        { status: 400 },
      );
    }

    const experiment = await ExperimentRepository.create({
      ...validation.data,
      id: Experiment.generateExperimentId(),
      dateCreated: new Date().toISOString(),
      userId: User.generateUserId(), // TODO: this should be dynamically retrieved from session
    });

    return NextResponse.json({ success: true, data: experiment }, { status: 201 });
  } catch (error) {
    logError("ISE when trying to add an experiment", error, "POST /api/experiment");

    return NextResponse.json<APIErrorResponse>(
      { success: false, error: MESSAGES.AnErrorOccuredTryAgainLater },
      { status: 500 },
    );
  }
});
