import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PlaceholderCard } from "@/components/ui/PlaceholderCard";

export default function SubprogramsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subprograms</h1>
          <p className="text-gray-600">Manage program subcategories and modules</p>
        </div>
        
        <PlaceholderCard
          title="Subprograms Management"
          description="Create, edit, and manage program subcategories"
        />
      </div>
    </DashboardLayout>
  );
}
