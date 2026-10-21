import {revalidatePublicContent} from "@/shared/utilities/revalidate-public-content";
import {AuthorizationError, ServerActionError} from "@/shared/exceptions/server-action-error";
import {IServerActionResult} from "@/shared/types/server-action-result";

interface IServerActionOptions {
  revalidatePublicPages?: boolean;
}

export function createServerAction<T>(
  callback: (...args: any[]) => Promise<T>,
  options?: IServerActionOptions
): (...args: any[]) => Promise<IServerActionResult<T>> {
  return async (...args: any[]) => {
    let isAuthorized = true;

    try {
      const data = await callback(...args);
      return {success: true, data};
    }
    catch (error) {
      isAuthorized = !(error instanceof AuthorizationError);

      if (error instanceof ServerActionError) {
        console.log(error)
        return {success: false, errorMessage: error.message, data: undefined as never};
      }
      else {
        console.log(error)
        return {success: false, errorMessage: "Unhandled error type", data: undefined as never};
      }
    }
    finally {
      if (options?.revalidatePublicPages && isAuthorized)
        revalidatePublicContent();
    }
  };
}
