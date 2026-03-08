import { getComments } from "../../lib/blog";
import { CommentSection } from "./CommentSection";

export async function CommentList({ slug }: { slug: string }) {
  const comments = await getComments(slug);
  return <CommentSection slug={slug} comments={comments} />;
}
