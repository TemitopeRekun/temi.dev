import BlogClient from "./blogClient";
import { AnimatedText } from "../../../../../components/common/AnimatedText";

export default function BlogPage() {
  return (
    <div className="space-y-6">
      <h1 className="sr-only">Blog Posts</h1>
      <AnimatedText
        phrase="Blog Posts"
        className="tracking-tight text-[var(--text)] text-4xl sm:text-5xl lg:text-6xl leading-tight"
      />
      <BlogClient />
    </div>
  );
}
