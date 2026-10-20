import {NextRequest} from "next/server";
import {FileManagerService} from "@/entities/file/services/file-manager-service";
import {formFile, formFolder, handleFileRoute} from "../file-route";

export async function POST(request: NextRequest) {
  return handleFileRoute(request, (form) => FileManagerService.upload(formFolder(form), formFile(form, "file")));
}
