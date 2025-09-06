import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PlaceholderCard } from "@/components/ui/PlaceholderCard";
import { AuthWrapper } from "@/components/auth/AuthWrapper";

export default function TrainingsPage() {
  return (
    <AuthWrapper>
      <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trainings</h1>
          <p className="text-gray-600">Manage training sessions and programs</p>
        </div>
        
        <PlaceholderCard 
          title="Training Management"
          description="Schedule, manage, and track training sessions and programs"
        />
      </div>
    </DashboardLayout>
    </AuthWrapper>
  );
}
