import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PlaceholderCard } from "@/components/ui/PlaceholderCard";

export default function TeachersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-600">Manage teacher contacts and information</p>
        </div>
        
        <PlaceholderCard
          title="Teacher Management"
          description="View, add, edit, and manage teacher records"
        />
      </div>
    </DashboardLayout>
  );
}
