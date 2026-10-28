import mongoDbConnect from "@/shared/services/mongodb-service/mongodb-service";
import {getRecordPublicPath, PUBLIC_PATH_PREFIXES} from "@/shared/utilities/public-paths";
import type {RevisionCollection} from "@/shared/types/revision";

interface IPublicPaths {
  pages: Set<string>;
  fileSlugs: Set<string>;
  fileLegacyPaths: Set<string>;
}

const CACHE_TTL = 60_000;

// On globalThis so the proxy sees changes made by server actions in the same process at once
const state = globalThis as typeof globalThis & {publicPathsVersion?: number};

let cache: {paths: IPublicPaths, loadedAt: number, version: number} | null = null;
let loading: Promise<IPublicPaths> | null = null;

export function invalidatePublicPaths() {
  state.publicPathsVersion = (state.publicPathsVersion ?? 0) + 1;
}

async function loadPublicPaths(): Promise<IPublicPaths> {
  const {connection} = await mongoDbConnect();
  const db = connection.db!;
  const collections = Object.keys(PUBLIC_PATH_PREFIXES) as RevisionCollection[];

  const [pageLists, files] = await Promise.all([
    Promise.all(collections.map(async (collection) => {
      const records = await db.collection(collection).find({}, {projection: {_id: 0, path: 1}}).toArray();

      return records
        .map((record) => typeof record.path == "string" ? getRecordPublicPath(collection, record.path) : null)
        .filter((path): path is string => path != null);
    })),
    db.collection("files").find({kind: "file"}, {projection: {_id: 0, slug: 1, legacyPath: 1}}).toArray()
  ]);

  return {
    pages: new Set(pageLists.flat()),
    fileSlugs: new Set(files.map((file) => file.slug)),
    fileLegacyPaths: new Set(files.map((file) => file.legacyPath).filter((path) => typeof path == "string"))
  };
}

async function getPublicPaths(): Promise<IPublicPaths> {
  const version = state.publicPathsVersion ?? 0;

  if (!cache || cache.version != version || Date.now() - cache.loadedAt > CACHE_TTL) {
    loading ??= loadPublicPaths().finally(() => loading = null);
    cache = {paths: await loading, loadedAt: Date.now(), version};
  }

  return cache.paths;
}

// Lets the proxy answer unknown addresses before Next renders and caches a 404 for each
export async function isKnownPublicPath(pathname: string): Promise<boolean> {
  return (await getPublicPaths()).pages.has(pathname);
}

// Same lookup as FileManagerService.findFile: a slug (optionally followed by the file name) or an address from the old storage
export async function isKnownFilePath(segments: string[]): Promise<boolean> {
  const {fileSlugs, fileLegacyPaths} = await getPublicPaths();

  return ((segments.length == 1 || segments.length == 2) && fileSlugs.has(segments[0]))
    || fileLegacyPaths.has("/" + segments.join("/"));
}
