import {NextRequest, NextResponse} from "next/server";
import {requirePermission} from "@/auth";
import {ServerActionError} from "@/shared/exceptions/server-action-error";
import {IServerActionResult} from "@/shared/types/server-action-result";
import {revalidatePublicContent} from "@/shared/utilities/revalidate-public-content";

export const MAX_FILE_REQUEST_SIZE = 100 * 1024 * 1024;

const result = <T>(body: IServerActionResult<T>, status = 200) => NextResponse.json(body, {status});

export async function handleFileRoute<T>(request: NextRequest, handler: (form: FormData) => Promise<T>): Promise<NextResponse> {
  try {
    await requirePermission("edit-files");
  }
  catch (error) {
    const errorMessage = error instanceof ServerActionError ? error.message : "Необхідна авторизація";
    return result({success: false, errorMessage, data: undefined as never}, 403);
  }

  const size = Number(request.headers.get("content-length"));

  if (!size || size > MAX_FILE_REQUEST_SIZE)
    return result({success: false, errorMessage: "Файл завеликий: не більше 100 МБ", data: undefined as never}, 413);

  try {
    const data = await handler(await request.formData());
    return result({success: true, data});
  }
  catch (error) {
    console.log(error);
    const errorMessage = error instanceof ServerActionError ? error.message : "Unhandled error type";

    return result({success: false, errorMessage, data: undefined as never}, error instanceof ServerActionError ? 400 : 500);
  }
  finally {
    revalidatePublicContent();
  }
}

export function formFolder(form: FormData): string | null {
  const value = form.get("folder");
  return typeof value == "string" && value ? value : null;
}

export function formFile(form: FormData, name: string): File {
  const value = form.get(name);

  if (!(value instanceof File))
    throw new ServerActionError("Файл не передано");

  return value;
}
