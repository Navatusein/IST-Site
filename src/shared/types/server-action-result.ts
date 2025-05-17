export interface IServerActionResult<T> {
  data: T;
  success: boolean;
  errorMessage?: string;
  errorType?: string;
}