"use server";

import { revalidatePath } from "next/cache";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export type ActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function likePostAction(slug: string): Promise<ActionState> {
  try {
    const res = await fetch(`${API_BASE}/api/blog/${slug}/like`, {
      method: "POST",
      cache: "no-store",
    });
    
    if (!res.ok) {
      return { success: false, message: "Failed to like post" };
    }
    
    revalidatePath(`/blog/${slug}`);
    return { success: true };
  } catch (error) {
    return { success: false, message: "Network error" };
  }
}

export async function addCommentAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const author = formData.get("author") as string;

  if (!slug || !content) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    const res = await fetch(`${API_BASE}/api/blog/${slug}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, author }),
      cache: "no-store",
    });

    if (!res.ok) {
      return { success: false, message: "Failed to post comment" };
    }

    revalidatePath(`/blog/${slug}`);
    return { success: true };
  } catch (error) {
    return { success: false, message: "Network error" };
  }
}
