import { AnimatedText } from "../../../../../components/common/AnimatedText";
import { Text } from "../../../../../components/ui/Text";

function apiBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL;
  return (env && env.trim().length > 0 ? env : "http://localhost:4000") as string;
}

type Counts = {
  totalProjects: number;
  totalPosts: number;
  totalLeads: number | null;
  newLeads7d: number | null;
};

async function getCounts(): Promise<Counts> {
  const base = apiBaseUrl();
  const [projectsRes, blogRes] = await Promise.all([
    fetch(`${base}/api/projects`, { cache: "no-store" }).catch(() => null),
    fetch(`${base}/api/blog?take=100`, { cache: "no-store" }).catch(() => null),
  ]);
  const projects =
    projectsRes && projectsRes.ok
      ? ((await projectsRes.json()) as unknown[])
      : [];
  const blog =
    blogRes && blogRes.ok
      ? ((await blogRes.json()) as { items: unknown[] }).items
      : [];
  const totalProjects = Array.isArray(projects) ? projects.length : 0;
  const totalPosts = Array.isArray(blog) ? blog.length : 0;
  const totalLeads: number | null = null;
  const newLeads7d: number | null = null;
  return { totalProjects, totalPosts, totalLeads, newLeads7d };
}

export default async function DashboardPage() {
  const counts: Counts = await getCounts();
  return (
    <div className="space-y-6">
      <h1 className="sr-only">Overview</h1>
      <AnimatedText
        phrase="Overview"
        className="tracking-tight text-[var(--text)] text-4xl sm:text-5xl lg:text-6xl leading-tight"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Total Projects" value={counts.totalProjects.toString()} />
        <Card title="Total Blog Posts" value={counts.totalPosts.toString()} />
        <Card
          title="Total Leads"
          value={
            counts.totalLeads !== null ? counts.totalLeads.toString() : "—"
          }
        />
        <Card
          title="New Leads (7d)"
          value={
            counts.newLeads7d !== null ? counts.newLeads7d.toString() : "—"
          }
        />
      </div>
    </div>
  );
}

function Card(props: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-(--border)/20 bg-(--surface) p-4">
      <Text className="text-sm text-(--muted)">{props.title}</Text>
      <p className="mt-2 text-3xl font-semibold text-(--text)">{props.value}</p>
    </div>
  );
}
