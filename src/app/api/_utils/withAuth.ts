import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { MESSAGES } from "@/presentation/constants/messages";
import { APIErrorResponse } from "@/core/types/api";
import { Session } from "next-auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withAuth<T extends (...args: any[]) => Promise<any>>(handler: T): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const session = (await getServerSession(authOptions)) as Session;

    if (!session?.user?.id) {
      return NextResponse.json<APIErrorResponse>(
        { success: false, error: MESSAGES.RequestIsUnauthorized },
        { status: 401 },
      ) as ReturnType<T>;
    }

    return handler(...args);
  }) as T;
}
