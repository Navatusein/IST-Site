import {NextRequest} from "next/server";
import {FileArchiveService} from "@/entities/file/services/file-archive-service";
import {formFile, formFolder, handleFileRoute} from "../file-route";

export async function POST(request: NextRequest) {
  return handleFileRoute(request, async (form) => {
    const archive = formFile(form, "archive");
    return FileArchiveService.import(formFolder(form), new Uint8Array(await archive.arrayBuffer()));
  });
}
