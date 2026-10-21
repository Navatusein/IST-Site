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

interface IPostFormProgressOptions {
  onProgress?: (loaded: number, total: number) => void;
  signal?: AbortSignal;
}

export function postFormWithProgress<T>(url: string, form: FormData, options: IPostFormProgressOptions = {}): Promise<IServerActionResult<T>> {
  return new Promise((resolve) => {
    const request = new XMLHttpRequest();
    const fail = (errorMessage: string) => resolve({success: false, errorMessage, data: undefined as never});

    request.open("POST", url);
    request.responseType = "json";

    request.upload.onprogress = (event) => {
      if (event.lengthComputable)
        options.onProgress?.(event.loaded, event.total);
    };

    request.onload = () => request.response ? resolve(request.response as IServerActionResult<T>) : fail("Не вдалося надіслати файл");
    request.onerror = () => fail("Не вдалося надіслати файл");
    request.onabort = () => fail("Скасовано");

    if (options.signal?.aborted)
      return fail("Скасовано");

    options.signal?.addEventListener("abort", () => request.abort(), {once: true});
    request.send(form);
  });
}
