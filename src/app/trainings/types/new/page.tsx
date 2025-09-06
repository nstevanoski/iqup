"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TrainingTypeForm } from "@/components/forms/TrainingTypeForm";
import { useUser } from "@/store/auth";
import { TrainingType } from "@/types";
import { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function NewTrainingTypePage() {
  const router = useRouter();
  const user = useUser();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: Partial<TrainingType>) => {
    setLoading(true);
    try {
      // In a real app, this would make an API call
      console.log("Creating training type:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to training types list
      router.push("/trainings/types");
    } catch (error) {
      console.error("Error creating training type:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/trainings/types");
  };

  const breadcrumbItems = [
    { label: "Trainings", href: "/trainings" },
    { label: "Training Types", href: "/trainings/types" },
    { label: "Create Training Type", href: "/trainings/types/new" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Breadcrumbs items={breadcrumbItems} />
        
        <TrainingTypeForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </DashboardLayout>
  );
}
