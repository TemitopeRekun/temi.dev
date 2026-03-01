import type { ReactNode } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Heading } from "../../../../components/ui/Heading";
import type { Route } from "next";

export default async function AdminProtectedLayout(
  props: Readonly<{ children: ReactNode }>,
) {
  const c = await cookies();
  const token = c.get("admin_jwt")?.value ?? null;
  if (!token) {
    redirect("/admin/login");
  }
  return (
    <div className="dark min-h-screen bg-(--bg) text-(--text)">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="border-r border-(--border)/20 bg-(--surface)">
          <div className="p-4">
            <Heading size="h4" as="h2" className="text-lg">
              Admin
            </Heading>
          </div>
          <nav className="flex flex-col gap-1 p-2">
            <SidebarLink href="/admin/dashboard" label="Dashboard Overview" />
            <SidebarLink href="/admin/projects" label="Projects" />
            <SidebarLink href="/admin/blog" label="Blog Posts" />
            <SidebarLink href="/admin/leads" label="Leads" />
            <SidebarLink href="/admin/settings" label="Settings" />
          </nav>
        </aside>
        <main className="p-6">{props.children}</main>
      </div>
    </div>
  );
}

function SidebarLink(props: { href: Route; label: string }) {
  return (
    <Link
      href={props.href}
      className="rounded-md px-3 py-2 text-sm text-(--text)/80 hover:bg-(--surface)/60 hover:text-(--text) transition-colors"
    >
      {props.label}
    </Link>
  );
}
