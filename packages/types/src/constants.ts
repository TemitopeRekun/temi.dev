/**
 * Cross-cutting constants shared by the API and the web app so both agree by
 * construction. Importing these (rather than re-declaring magic numbers in each
 * app) means a single edit here updates every call site.
 */

/** Maximum accepted upload size, in megabytes (used for human-facing copy). */
export const MAX_UPLOAD_MB = 5;

/** Maximum accepted upload size, in bytes. Enforced by the API and previewed
 *  client-side so the browser can reject oversized files before the round-trip. */
export const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

/**
 * Allowlisted image mimetypes mapped to their canonical file extension. The API
 * verifies both the declared mimetype and the file's magic bytes against this
 * map; the web app uses the keys to build the file picker's `accept` filter.
 */
export const ALLOWED_IMAGE_MIME_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
};

/** The accepted image mimetypes as a list (derived from the mime→ext map). */
export const ALLOWED_IMAGE_MIME: readonly string[] =
  Object.keys(ALLOWED_IMAGE_MIME_EXT);

/** Default page size for cursor-paginated list endpoints. */
export const DEFAULT_PAGE_SIZE = 20;

/** Hard upper bound on a single page request, to cap DB work per call. */
export const MAX_PAGE_SIZE = 50;
