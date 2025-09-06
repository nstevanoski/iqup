"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TTAccountForm } from "@/components/forms/TTAccountForm";
import { useUser } from "@/store/auth";
import { TeacherTrainerAccount } from "@/types";
import { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function NewTTAccountPage() {
  const router = useRouter();
  const user = useUser();
  const [loading, setLoading] = useState(false);

  // Only HQ users can create TT accounts
  if (user?.role !== "HQ") {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Access Denied
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Only HQ users can create teacher trainer accounts.</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const breadcrumbItems = [
    { label: "Teacher Trainers", href: "/teacher-trainers" },
    { label: "Create New TT Account", href: "/teacher-trainers/new" },
  ];

  const handleSubmit = async (data: Partial<TeacherTrainerAccount>) => {
    setLoading(true);
    try {
      // In a real app, this would make an API call to create the TT account
      console.log("Creating TT account:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect back to teacher trainers list
      router.push("/teacher-trainers");
    } catch (error) {
      console.error("Error creating TT account:", error);
      alert("Error creating TT account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/teacher-trainers");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Breadcrumbs items={breadcrumbItems} />
        
        <TTAccountForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </DashboardLayout>
  );
}
