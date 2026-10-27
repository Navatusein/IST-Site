import {model, models, Schema} from "mongoose";

interface IRedirectDocument {
  fromPath: string;
  toPath: string;
}

const redirectSchema = new Schema({
  fromPath: {type: Schema.Types.String, required: true, unique: true},
  toPath: {type: Schema.Types.String, required: true},
}, {timestamps: true});

redirectSchema.index({toPath: 1});

const RedirectModel = models?.Redirect || model("Redirect", redirectSchema, "redirects");

const CACHE_TTL = 60_000;

// On globalThis so the proxy sees changes made by server actions in the same process at once
const state = globalThis as typeof globalThis & {redirectsVersion?: number};

let cache: {redirects: Map<string, string>, loadedAt: number, version: number} | null = null;

function invalidate() {
  state.redirectsVersion = (state.redirectsVersion ?? 0) + 1;
}

// Old addresses keep leading to the record, so links in search results and on other sites survive a path change
export async function recordPathChange(fromPath: string, toPath: string) {
  if (fromPath == toPath)
    return;

  await RedirectModel.deleteMany({fromPath: toPath});
  await RedirectModel.updateMany({toPath: fromPath}, {$set: {toPath}});
  await RedirectModel.updateOne({fromPath}, {$set: {toPath}}, {upsert: true});

  invalidate();
}

// A record now lives at this address again, so it must not redirect anymore
export async function removeRedirectFrom(path: string) {
  const {deletedCount} = await RedirectModel.deleteMany({fromPath: path});

  if (deletedCount)
    invalidate();
}

export async function findRedirectTarget(fromPath: string): Promise<string | null> {
  const version = state.redirectsVersion ?? 0;

  if (!cache || cache.version != version || Date.now() - cache.loadedAt > CACHE_TTL) {
    const redirects = await RedirectModel.find({}, {fromPath: 1, toPath: 1}).lean<IRedirectDocument[]>();
    cache = {redirects: new Map(redirects.map((redirect) => [redirect.fromPath, redirect.toPath])), loadedAt: Date.now(), version};
  }

  return cache.redirects.get(fromPath) ?? null;
}
