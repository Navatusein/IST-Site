import {NextRequest, NextResponse} from "next/server";
import {requirePermission} from "@/auth";
import {ServerActionError} from "@/shared/exceptions/server-action-error";
import {FileArchiveService} from "@/entities/file/services/file-archive-service";

export async function GET(request: NextRequest) {
  const isExport = request.nextUrl.searchParams.has("export");
  const slugs = request.nextUrl.searchParams.get("slugs")?.split(",").filter(Boolean) ?? null;

  try {
    await requirePermission(isExport ? "edit-files" : undefined);
  }
  catch (error) {
    const message = error instanceof ServerActionError ? error.message : "Необхідна авторизація";
    return new NextResponse(message, {status: 403});
  }

  if (!isExport && !slugs?.length)
    return new NextResponse("Не вибрано файлів", {status: 400});

  const entries = await FileArchiveService.collect(slugs);

  if (entries.length == 0)
    return new NextResponse("Файли не знайдено", {status: 404});

  const date = new Date().toISOString().slice(0, 10);
  const single = slugs?.length == 1 && entries[0].document.kind == "directory" ? entries[0].document.name : null;
  const name = isExport ? `files-export-${date}.zip` : `${single ?? `files-${date}`}.zip`;

  return new NextResponse(FileArchiveService.createArchiveStream(entries, isExport), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(name)}`,
      "Cache-Control": "private, no-store"
    }
  });
}
