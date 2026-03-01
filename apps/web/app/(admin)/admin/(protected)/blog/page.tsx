import BlogClient from "./blogClient";
import { Heading } from "../../../../../components/ui/Heading";

export default function BlogPage() {
  return (
    <div className="space-y-6">
      <Heading size="h2" as="h1">
        Blog Posts
      </Heading>
      <BlogClient />
    </div>
  );
}
