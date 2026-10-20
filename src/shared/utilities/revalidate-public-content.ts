import {revalidatePath, revalidateTag} from "next/cache";
import {PUBLIC_DATA_TAG} from "@/shared/utilities/cache-public-data";

export function revalidatePublicContent(): void {
  revalidateTag(PUBLIC_DATA_TAG, {expire: 0});
  revalidatePath("/", "layout");
}
