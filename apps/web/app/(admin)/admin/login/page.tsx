import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Heading } from "../../../../components/ui/Heading";
import { Text } from "../../../../components/ui/Text";
import { LoginForm } from "./pageClient";

export default async function AdminLoginPage() {
  const c = await cookies();
  if (c.get("admin_jwt")) {
    redirect("/admin/dashboard");
  }
  return (
    <div className="dark min-h-screen bg-(--bg) text-(--text) grid place-items-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-(--border)/20 bg-(--surface) p-6">
        <Heading size="h3" as="h1" className="mb-2">
          Admin Login
        </Heading>
        <Text className="mb-4 text-(--muted)">
          Use your admin credentials to access the dashboard.
        </Text>
        <LoginForm />
      </div>
    </div>
  );
}
