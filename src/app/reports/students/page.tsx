import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PlaceholderCard } from "@/components/ui/PlaceholderCard";

export default function StudentsReportPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students Report</h1>
          <p className="text-gray-600">View and analyze student data and statistics</p>
        </div>
        
        <PlaceholderCard
          title="Students Report"
          description="Generate and view student analytics and reports"
        />
      </div>
    </DashboardLayout>
  );
}
