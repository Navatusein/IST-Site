import {NextRequest, NextResponse} from "next/server";
import {createReadStream} from "node:fs";
import {Readable} from "node:stream";
import {FileManagerService} from "@/entities/file/services/file-manager-service";

const ACTIVE_CONTENT_TYPES = /^(text\/html|application\/xhtml\+xml|image\/svg\+xml|text\/xml|application\/xml|text\/javascript|application\/javascript)/i;

export async function GET(request: NextRequest, {params}: {params: Promise<{path: string[]}>}) {
  const {path} = await params;
  const file = await FileManagerService.findServableFile(path);

  if (!file)
    return new NextResponse(null, {status: 404});

  const disposition = request.nextUrl.searchParams.has("download") ? "attachment" : "inline";

  return new NextResponse(Readable.toWeb(createReadStream(file.storagePath)) as ReadableStream, {
    status: 200,
    headers: {
      "Content-Type": file.mimeType,
      "Content-Length": String(file.size),
      "Content-Disposition": `${disposition}; filename*=UTF-8''${encodeURIComponent(file.name)}`,
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
      ...(ACTIVE_CONTENT_TYPES.test(file.mimeType) && {"Content-Security-Policy": "sandbox; default-src 'none'; img-src data:; style-src 'unsafe-inline'"})
    },
  });
}
