import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PlaceholderCard } from "@/components/ui/PlaceholderCard";
import { AuthWrapper } from "@/components/auth/AuthWrapper";

export default function SubprogramsPage() {
  return (
    <AuthWrapper>
      <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subprograms</h1>
          <p className="text-gray-600">Manage program subcategories and modules</p>
        </div>
        
        <PlaceholderCard 
          title="Subprograms Management"
          description="Create and manage subprograms within main programs"
        />
      </div>
    </DashboardLayout>
    </AuthWrapper>
  );
}
