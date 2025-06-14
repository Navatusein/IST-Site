import {ServerActionError} from "@/shared/exceptions/server-action-error";
import {IServerActionResult} from "@/shared/types/server-action-result";

export function createServerAction<T>(callback: (...args: any[]) => Promise<T>): (...args: any[]) => Promise<IServerActionResult<T>> {
  return async (...args: any[]) => {
    try {
      return {success: true, data: await callback(...args)};
    }
    catch (error) {
      if (error instanceof ServerActionError) {
        console.log(error)
        return {success: false, error: error.message, data: undefined as never};
      }
      else {
        console.log(error)
        return {success: false, error: "Unhandled error type", data: undefined as never};
      }
    }
  };
}