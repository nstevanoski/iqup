import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PlaceholderCard } from "@/components/ui/PlaceholderCard";
import { AuthWrapper } from "@/components/auth/AuthWrapper";

export default function StudentsPage() {
  return (
    <AuthWrapper>
      <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600">Manage student information and records</p>
        </div>
        
        <PlaceholderCard 
          title="Student Management"
          description="View, add, edit, and manage student profiles and records"
        />
      </div>
    </DashboardLayout>
    </AuthWrapper>
  );
}
