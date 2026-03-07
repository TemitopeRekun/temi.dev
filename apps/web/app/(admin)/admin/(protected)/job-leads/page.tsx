import { cookies } from "next/headers";
import { JobLeadsClient } from "./JobLeadsClient";
import { AnimatedText } from "../../../../../components/common/AnimatedText";

export default async function JobLeadsPage() {
  const c = await cookies();
  const token = c.get("admin_jwt")?.value ?? "";

  return (
    <div className="space-y-6">
      <AnimatedText
        phrase="Job Leads"
        className="tracking-tight text-[var(--text)] text-4xl sm:text-5xl lg:text-6xl leading-tight"
      />
      <JobLeadsClient token={token} />
    </div>
  );
}
