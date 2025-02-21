export interface APISuccessResponse<T> {
  success: true;
  data: T;
}

export interface APIErrorResponse<
  TFieldErrors extends Partial<Record<string, string>> = Partial<Record<string, string>>,
> {
  success: false;
  fieldErrors?: Partial<TFieldErrors>; // Ensure only present fields are included
  error?: string;
}

export type APIResponse<
  T,
  TFieldErrors extends Partial<Record<string, string>> = Partial<Record<string, string>>,
> = APISuccessResponse<T> | APIErrorResponse<TFieldErrors>;
