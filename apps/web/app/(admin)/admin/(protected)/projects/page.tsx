import ProjectsClient from "./projectsClient";
import { Heading } from "../../../../../components/ui/Heading";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <Heading size="h2" as="h1">
        Projects
      </Heading>
      <ProjectsClient />
    </div>
  );
}
