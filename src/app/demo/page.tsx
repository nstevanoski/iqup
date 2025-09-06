import { StudentsTable } from "@/components/examples/students-table";
import { AuthWrapper } from "@/components/auth/AuthWrapper";

export default function DemoPage() {
  return (
    <AuthWrapper>
      <div className="container mx-auto py-6">
        <StudentsTable />
      </div>
    </AuthWrapper>
  );
}
