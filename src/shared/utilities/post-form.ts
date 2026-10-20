import {IServerActionResult} from "@/shared/types/server-action-result";

export async function postForm<T>(url: string, form: FormData): Promise<IServerActionResult<T>> {
  try {
    const response = await fetch(url, {method: "POST", body: form});
    return await response.json() as IServerActionResult<T>;
  }
  catch {
    return {success: false, errorMessage: "Не вдалося надіслати файл", data: undefined as never};
  }
}
