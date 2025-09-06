import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PlaceholderCard } from "@/components/ui/PlaceholderCard";
import { AuthWrapper } from "@/components/auth/AuthWrapper";

export default function StudentReportsPage() {
  return (
    <AuthWrapper>
      <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Reports</h1>
          <p className="text-gray-600">View and analyze student performance and enrollment reports</p>
        </div>
        
        <PlaceholderCard 
          title="Student Reports"
          description="Generate and view student performance, enrollment, and progress reports"
        />
      </div>
    </DashboardLayout>
    </AuthWrapper>
  );
}
