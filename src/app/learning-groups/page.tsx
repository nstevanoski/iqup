import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PlaceholderCard } from "@/components/ui/PlaceholderCard";
import { AuthWrapper } from "@/components/auth/AuthWrapper";

export default function LearningGroupsPage() {
  return (
    <AuthWrapper>
      <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Groups</h1>
          <p className="text-gray-600">Manage student learning groups and classes</p>
        </div>
        
        <PlaceholderCard 
          title="Learning Groups Management"
          description="Create and manage learning groups, classes, and student assignments"
        />
      </div>
    </DashboardLayout>
    </AuthWrapper>
  );
}
