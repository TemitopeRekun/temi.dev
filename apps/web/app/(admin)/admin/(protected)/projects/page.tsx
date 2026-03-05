import ProjectsClient from "./projectsClient";
import { AnimatedText } from "../../../../../components/common/AnimatedText";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <h1 className="sr-only">Projects</h1>
      <AnimatedText
        phrase="Projects"
        className="tracking-tight text-[var(--text)] text-4xl sm:text-5xl lg:text-6xl leading-tight"
      />
      <ProjectsClient />
    </div>
  );
}
