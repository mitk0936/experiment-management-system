import { ZodError } from "zod";

export function extractZodErrors<T>(validation: { success: false; error?: ZodError<T> }) {
  return validation.error?.issues.reduce(
    (acc, issue) => {
      acc[issue.path[0]] = issue.message;
      return acc;
    },
    {} as Record<string, string>,
  );
}
