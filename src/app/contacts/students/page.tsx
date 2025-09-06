import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PlaceholderCard } from "@/components/ui/PlaceholderCard";

export default function StudentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600">Manage student contacts and information</p>
        </div>
        
        <PlaceholderCard
          title="Student Management"
          description="View, add, edit, and manage student records"
        />
      </div>
    </DashboardLayout>
  );
}
