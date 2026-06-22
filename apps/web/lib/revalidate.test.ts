import { describe, it, expect, vi, beforeEach } from "vitest";

const { revalidateTag } = vi.hoisted(() => ({ revalidateTag: vi.fn() }));
vi.mock("next/cache", () => ({ revalidateTag }));

import { revalidateContent, CONTENT_TAG } from "./revalidate";

describe("revalidateContent", () => {
  beforeEach(() => revalidateTag.mockReset());

  it("invalidates each provided tag", () => {
    revalidateContent(CONTENT_TAG.posts, CONTENT_TAG.projects);
    expect(revalidateTag).toHaveBeenCalledWith("posts");
    expect(revalidateTag).toHaveBeenCalledWith("projects");
    expect(revalidateTag).toHaveBeenCalledTimes(2);
  });

  it("invalidates nothing when called with no tags", () => {
    revalidateContent();
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
