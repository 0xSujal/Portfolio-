const BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL;

/**
 * Resolves a root-relative `/public` path to the CDN it's migrated to.
 * Falls back to the local path when no base is configured, so dev works
 * without R2 credentials and a project can be checked out and run cold.
 */
export function assetUrl(path: string): string {
  return BASE && path.startsWith("/") ? `${BASE}${path}` : path;
}
