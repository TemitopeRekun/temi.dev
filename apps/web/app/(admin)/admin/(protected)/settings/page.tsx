import { Heading } from "../../../../../components/ui/Heading";
import { Text } from "../../../../../components/ui/Text";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Heading size="h2" as="h1">
        Settings
      </Heading>
      <div className="rounded-2xl border border-(--border)/20 bg-(--surface) p-4">
        <Text className="text-(--muted)">Settings panel coming soon.</Text>
      </div>
    </div>
  );
}
