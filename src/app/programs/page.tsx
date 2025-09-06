import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PlaceholderCard } from "@/components/ui/PlaceholderCard";

export default function ProgramsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programs</h1>
          <p className="text-gray-600">Manage educational programs</p>
        </div>
        
        <PlaceholderCard
          title="Programs Management"
          description="Create, edit, and manage educational programs"
        />
      </div>
    </DashboardLayout>
  );
}
