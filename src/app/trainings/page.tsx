import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PlaceholderCard } from "@/components/ui/PlaceholderCard";

export default function TrainingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trainings</h1>
          <p className="text-gray-600">Manage training sessions and schedules</p>
        </div>
        
        <PlaceholderCard
          title="Training Management"
          description="Create, schedule, and manage training sessions"
        />
      </div>
    </DashboardLayout>
  );
}
