import {revalidatePath, revalidateTag} from "next/cache";
import {PUBLIC_DATA_TAG} from "@/shared/utilities/cache-public-data";
import {invalidatePublicPaths} from "@/shared/services/public-path-service/public-path-service";

export function revalidatePublicContent(): void {
  revalidateTag(PUBLIC_DATA_TAG, {expire: 0});
  revalidatePath("/", "layout");
  invalidatePublicPaths();
}
