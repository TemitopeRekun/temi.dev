import LeadsClient from "./leadsClient";
import { AnimatedText } from "../../../../../components/common/AnimatedText";

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <h1 className="sr-only">Leads</h1>
      <AnimatedText
        phrase="Leads"
        className="tracking-tight text-[var(--text)] text-4xl sm:text-5xl lg:text-6xl leading-tight"
      />
      <LeadsClient />
    </div>
  );
}
