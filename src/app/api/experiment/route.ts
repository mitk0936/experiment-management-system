"use server";

import { NextResponse } from "next/server";
import { MESSAGES } from "@/presentation/constants/messages";
import { logError } from "@/core/utils/logger";
import { experimentSchema } from "@/core/validation/experiment/schema";
import { ExperimentRepository } from "@/core/repositories/Experiment/ExperimentRepository";
import { extractZodErrors } from "@/core/validation/utils";
import { APIErrorResponse, APIResponse } from "@/core/types/api";
import { Experiment, IExperiment } from "@/core/entities/Experiment";
import { withAuth } from "../_utils/withAuth";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export const GET = withAuth(async function (): Promise<NextResponse<APIResponse<IExperiment[]>>> {
  try {
    const experiments = await ExperimentRepository.getAll();
    return NextResponse.json(
      {
        success: true,
        data: experiments,
      },
      { status: 200 },
    );
  } catch (error) {
    logError("ISE when trying to fetch experiments", error, "GET /api/experiment");

    return NextResponse.json<APIErrorResponse>(
      { success: false, error: MESSAGES.AnErrorOccuredTryAgainLater },
      { status: 500 },
    );
  }
});

export const POST = withAuth(async function (
  req: Request,
): Promise<NextResponse<APIResponse<IExperiment>>> {
  try {
    const session = (await getServerSession(authOptions)) as Session;
    const body = await req.json();
    const validation = experimentSchema.safeParse(body);

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
      userId: session.user.id,
    });

    return NextResponse.json(
      {
        success: true,
        data: experiment,
      },
      { status: 201 },
    );
  } catch (error) {
    logError("ISE when trying to add an experiment", error, "POST /api/experiment");

    return NextResponse.json<APIErrorResponse>(
      { success: false, error: MESSAGES.AnErrorOccuredTryAgainLater },
      { status: 500 },
    );
  }
});
