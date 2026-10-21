import {NextRequest, NextResponse} from "next/server";
import {createReadStream} from "node:fs";
import {Readable} from "node:stream";
import {FileManagerService} from "@/entities/file/services/file-manager-service";

const PASSIVE_CONTENT_TYPES = /^(image\/(?!svg\+xml)[\w.+-]+|video\/[\w.+-]+|audio\/[\w.+-]+|application\/pdf|text\/plain)(;|$)/i;

const SANDBOX_POLICY = "sandbox; default-src 'none'; img-src data:; style-src 'unsafe-inline'";

function parseRange(header: string, size: number): {start: number, end: number} | null | undefined {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());

  if (!match || (!match[1] && !match[2]))
    return undefined;

  if (size == 0)
    return null;

  if (!match[1]) {
    const length = Number(match[2]);
    return length > 0 ? {start: Math.max(size - length, 0), end: size - 1} : null;
  }

  const start = Number(match[1]);
  const end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;

  return start <= end ? {start, end} : null;
}

export async function GET(request: NextRequest, {params}: {params: Promise<{path: string[]}>}) {
  const {path} = await params;
  const file = await FileManagerService.findServableFile(path);

  if (!file)
    return new NextResponse(null, {status: 404});

  const disposition = request.nextUrl.searchParams.has("download") ? "attachment" : "inline";

  const headers: Record<string, string> = {
    "Content-Type": file.mimeType,
    "Content-Disposition": `${disposition}; filename*=UTF-8''${encodeURIComponent(file.name)}`,
    "Cache-Control": "private, max-age=3600",
    "Accept-Ranges": "bytes",
    "X-Content-Type-Options": "nosniff",
    ...(!PASSIVE_CONTENT_TYPES.test(file.mimeType) && {"Content-Security-Policy": SANDBOX_POLICY})
  };

  const rangeHeader = request.headers.get("range");
  const range = rangeHeader ? parseRange(rangeHeader, file.size) : undefined;

  if (range === undefined) {
    return new NextResponse(Readable.toWeb(createReadStream(file.storagePath)) as ReadableStream, {
      status: 200,
      headers: {...headers, "Content-Length": String(file.size)}
    });
  }

  if (range === null) {
    return new NextResponse(null, {
      status: 416,
      headers: {...headers, "Content-Range": `bytes */${file.size}`}
    });
  }

  return new NextResponse(Readable.toWeb(createReadStream(file.storagePath, range)) as ReadableStream, {
    status: 206,
    headers: {
      ...headers,
      "Content-Length": String(range.end - range.start + 1),
      "Content-Range": `bytes ${range.start}-${range.end}/${file.size}`
    }
  });
}
