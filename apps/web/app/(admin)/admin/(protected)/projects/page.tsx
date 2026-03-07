import { cookies } from "next/headers";
import ProjectsClient from "./projectsClient";
import { AnimatedText } from "../../../../../components/common/AnimatedText";

export default async function ProjectsPage() {
  const c = await cookies();
  const token = c.get("admin_jwt")?.value ?? "";

  return (
    <div className="space-y-6">
      <h1 className="sr-only">Projects</h1>
      <AnimatedText
        phrase="Projects"
        className="tracking-tight text-[var(--text)] text-4xl sm:text-5xl lg:text-6xl leading-tight"
      />
      <ProjectsClient token={token} />
    </div>
  );
}
