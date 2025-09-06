import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PlaceholderCard } from "@/components/ui/PlaceholderCard";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure system settings and preferences</p>
        </div>
        
        <PlaceholderCard
          title="System Settings"
          description="Configure application settings, user preferences, and system options"
        />
      </div>
    </DashboardLayout>
  );
}
