"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TrainingForm } from "@/components/forms/TrainingForm";
import { useUser } from "@/store/auth";
import { Training } from "@/types";
import { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function NewTrainingPage() {
  const router = useRouter();
  const user = useUser();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: Partial<Training>) => {
    setLoading(true);
    try {
      // In a real app, this would make an API call
      console.log("Creating training:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to trainings list
      router.push("/trainings");
    } catch (error) {
      console.error("Error creating training:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/trainings");
  };

  const breadcrumbItems = [
    { label: "Trainings", href: "/trainings" },
    { label: "Create Training", href: "/trainings/new" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Breadcrumbs items={breadcrumbItems} />
        
        <TrainingForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </DashboardLayout>
  );
}
