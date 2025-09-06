import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PlaceholderCard } from "@/components/ui/PlaceholderCard";
import { AuthWrapper } from "@/components/auth/AuthWrapper";

export default function TeacherTrainersPage() {
  return (
    <AuthWrapper>
      <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Trainers</h1>
          <p className="text-gray-600">Manage teacher trainer profiles and assignments</p>
        </div>
        
        <PlaceholderCard 
          title="Teacher Trainer Management"
          description="View, add, edit, and manage teacher trainer profiles and assignments"
        />
      </div>
    </DashboardLayout>
    </AuthWrapper>
  );
}
