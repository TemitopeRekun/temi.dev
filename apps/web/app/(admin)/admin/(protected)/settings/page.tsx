import { AnimatedText } from "../../../../../components/common/AnimatedText";
import { Text } from "../../../../../components/ui/Text";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="sr-only">Settings</h1>
      <AnimatedText
        phrase="Settings"
        className="tracking-tight text-[var(--text)] text-4xl sm:text-5xl lg:text-6xl leading-tight"
      />
      <div className="rounded-2xl border border-(--border)/20 bg-(--surface) p-4">
        <Text className="text-(--muted)">Settings panel coming soon.</Text>
      </div>
    </div>
  );
}
