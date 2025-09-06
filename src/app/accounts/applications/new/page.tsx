"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { useUser } from "@/store/auth";
import { Application } from "@/types";
import { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function NewApplicationPage() {
  const router = useRouter();
  const user = useUser();
  const [loading, setLoading] = useState(false);

  const breadcrumbItems = [
    { label: "Accounts", href: "/accounts" },
    { label: "New Application", href: "/accounts/applications/new" },
  ];

  const handleSubmit = async (data: Partial<Application>) => {
    setLoading(true);
    try {
      // In a real app, this would make an API call to submit the application
      console.log("Submitting application:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect back to accounts page
      router.push("/accounts");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error submitting application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/accounts");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Breadcrumbs items={breadcrumbItems} />
        
        <ApplicationForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </DashboardLayout>
  );
}
