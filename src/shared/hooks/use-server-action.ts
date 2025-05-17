import {IServerActionResult} from "@/shared/types/server-action-result";

export async function useServerAction<T> (serverActionResult: Promise<IServerActionResult<T>>) {
  const result = await serverActionResult;

  if (result.success) {
    return result.data!;
  }
  else {
    throw new Error(result.errorMessage);
  }
}