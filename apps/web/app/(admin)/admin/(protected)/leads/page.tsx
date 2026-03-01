import LeadsClient from "./leadsClient";
import { Heading } from "../../../../../components/ui/Heading";

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <Heading size="h2" as="h1">
        Leads
      </Heading>
      <LeadsClient />
    </div>
  );
}
