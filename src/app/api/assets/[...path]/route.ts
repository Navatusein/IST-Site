import {NextRequest, NextResponse} from "next/server";
import {FileManagerService} from "@/shared/services/file-manager-service/file-manager-service";

export async function GET(request: NextRequest, {params}: {params: Promise<{path: string[]}>}) {
  try {
    const {path: assetPath} = await params;
    const {buffer, mimeType} = FileManagerService.getFileBufferAndMimeType(`/${assetPath.join("/")}`);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": mimeType
      },
    });
  }
  catch (error: any) {
    return new NextResponse( null, {status: 404});
  }
}
