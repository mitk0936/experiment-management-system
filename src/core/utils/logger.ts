const log = (level: "INFO" | "ERROR" | "WARN", message: string, context?: string) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}]${context ? ` [${context}]` : ""} ${message}`;

  if (level === "ERROR") {
    console.error(logMessage);
  } else if (level === "WARN") {
    console.warn(logMessage);
  } else {
    console.log(logMessage);
  }
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.stack || error.message; // Prefer stack trace if available
  }
  if (typeof error === "string") {
    return error;
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as Record<string, unknown>).message);
  }
  return "Unknown error occurred.";
};

export const logInfo = (message: string, context?: string) => log("INFO", message, context);
export const logWarn = (message: string, context?: string) => log("WARN", message, context);
export const logError = (message: string, error: unknown, context?: string) => {
  const errorMessage = getErrorMessage(error);
  log("ERROR", `${message} - ${errorMessage}`, context);
};
