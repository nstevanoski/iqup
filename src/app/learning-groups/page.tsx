import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PlaceholderCard } from "@/components/ui/PlaceholderCard";

export default function LearningGroupsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Learning Groups</h1>
          <p className="text-gray-600">Manage learning groups and class assignments</p>
        </div>
        
        <PlaceholderCard
          title="Learning Groups Management"
          description="Create, edit, and manage learning groups"
        />
      </div>
    </DashboardLayout>
  );
}
