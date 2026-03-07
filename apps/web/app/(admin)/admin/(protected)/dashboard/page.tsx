import { cookies } from "next/headers";
import { AnimatedText } from "../../../../../components/common/AnimatedText";
import { Text } from "../../../../../components/ui/Text";

function apiBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL;
  return (env && env.trim().length > 0 ? env : "http://localhost:4000") as string;
}

type Counts = {
  totalProjects: number;
  totalPosts: number;
  totalLeads: number;
  newLeads7d: number;
  totalJobLeads: number;
};

async function getCounts(token: string): Promise<Counts> {
  const base = apiBaseUrl();
  const res = await fetch(`${base}/api/admin/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  }).catch(() => null);

  if (!res || !res.ok) {
    return {
      totalProjects: 0,
      totalPosts: 0,
      totalLeads: 0,
      newLeads7d: 0,
      totalJobLeads: 0,
    };
  }
  return res.json();
}

export default async function DashboardPage() {
  const c = await cookies();
  const token = c.get("admin_jwt")?.value ?? "";
  const counts = await getCounts(token);

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
        <Card title="Total Leads" value={counts.totalLeads.toString()} />
        <Card title="Job Leads" value={counts.totalJobLeads.toString()} />
        <Card title="New Leads (7d)" value={counts.newLeads7d.toString()} />
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
