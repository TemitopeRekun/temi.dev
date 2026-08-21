import { ImageResponse } from "next/og";
import { brandIconElement } from "../../lib/brandIcon";

/**
 * 512px app icon for the web manifest.
 *
 * A separate route rather than another `size` export on `app/icon.tsx`: the
 * multi-size icon convention generates hashed URLs, and the manifest needs a
 * stable path to point at. Browsers require an icon of at least 192px before
 * offering to install a site, so the 32px favicon cannot serve this purpose.
 */
const size = { width: 512, height: 512 };

// The mark never changes, so there is nothing to render per request.
export const dynamic = "force-static";

export function GET(): Response {
  return new ImageResponse(brandIconElement(size.width), size);
}
