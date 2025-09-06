import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PlaceholderCard } from "@/components/ui/PlaceholderCard";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your dashboard</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PlaceholderCard
            title="Total Students"
            description="Active students across all programs"
          />
          <PlaceholderCard
            title="Total Teachers"
            description="Active teaching staff"
          />
          <PlaceholderCard
            title="Active Programs"
            description="Currently running programs"
          />
          <PlaceholderCard
            title="Completed Trainings"
            description="Training sessions completed this month"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PlaceholderCard
            title="Recent Activity"
            description="Latest system activities"
          />
          <PlaceholderCard
            title="Quick Actions"
            description="Common tasks and shortcuts"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
