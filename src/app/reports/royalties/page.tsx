import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PlaceholderCard } from "@/components/ui/PlaceholderCard";

export default function RoyaltiesReportPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Royalties Report</h1>
          <p className="text-gray-600">View and analyze royalty payments and distributions</p>
        </div>
        
        <PlaceholderCard
          title="Royalties Report"
          description="Generate and view royalty payment reports"
        />
      </div>
    </DashboardLayout>
  );
}
