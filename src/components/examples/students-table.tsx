"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { DataTable } from "@/components/ui/data-table";
import { FormDrawer } from "@/components/ui/form-drawer";
import { FormDialog } from "@/components/ui/form-dialog";
import { FormInput, FormSelect, FormCheckbox } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import { Student } from "@/types";
import { apiClient } from "@/lib/api-client";

// Zod schema for student form
const studentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  grade: z.string().min(1, "Grade is required"),
  school: z.string().optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  parentEmail: z.string().email("Invalid parent email").optional().or(z.literal("")),
  address: z.string().optional(),
  programId: z.string().optional(),
  subProgramId: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

// Mock data
const mockStudents: Student[] = [
  {
    id: "1",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@email.com",
    phone: "+1-555-2001",
    dateOfBirth: new Date("2010-04-12"),
    grade: "5th",
    school: "Elementary School NYC",
    parentName: "Robert Johnson",
    parentPhone: "+1-555-2002",
    parentEmail: "robert.johnson@email.com",
    address: "500 Student St, New York, NY 10004",
    isActive: true,
    enrollmentDate: new Date("2024-01-15"),
    programId: "1",
    subProgramId: "1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    firstName: "Bob",
    lastName: "Smith",
    email: "bob.smith@email.com",
    phone: "+1-555-2003",
    dateOfBirth: new Date("2009-08-25"),
    grade: "6th",
    school: "Middle School LA",
    parentName: "Mary Smith",
    parentPhone: "+1-555-2004",
    parentEmail: "mary.smith@email.com",
    address: "600 Learning Ave, Los Angeles, CA 90213",
    isActive: true,
    enrollmentDate: new Date("2024-01-20"),
    programId: "2",
    subProgramId: "4",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
];

// Mock programs for the select
const mockPrograms = [
  { value: "1", label: "English Language Program" },
  { value: "2", label: "Mathematics Excellence" },
  { value: "3", label: "Science Discovery" },
  { value: "4", label: "Computer Programming" },
];

const mockSubPrograms = [
  { value: "1", label: "Basic English" },
  { value: "2", label: "Intermediate English" },
  { value: "3", label: "Advanced English" },
  { value: "4", label: "Basic Math" },
  { value: "5", label: "Algebra" },
  { value: "6", label: "Geometry" },
];

export function StudentsTable() {
  const [students, setStudents] = React.useState<Student[]>(mockStudents);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = React.useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = React.useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Table columns
  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "firstName",
      header: "First Name",
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "grade",
      header: "Grade",
    },
    {
      accessorKey: "school",
      header: "School",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.getValue("isActive") ? "default" : "secondary"}>
          {row.getValue("isActive") ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      accessorKey: "enrollmentDate",
      header: "Enrolled",
      cell: ({ row }) => {
        const date = row.getValue("enrollmentDate") as Date;
        return date ? date.toLocaleDateString() : "N/A";
      },
    },
  ];

  // Handlers
  const handleCreate = async (data: StudentFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newStudent: Student = {
        id: Date.now().toString(),
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
        isActive: true,
        enrollmentDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setStudents(prev => [...prev, newStudent]);
      setIsCreateDrawerOpen(false);
    } catch (error) {
      console.error("Error creating student:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (data: StudentFormData) => {
    if (!selectedStudent) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedStudent: Student = {
        ...selectedStudent,
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
        updatedAt: new Date(),
      };
      
      setStudents(prev => 
        prev.map(student => 
          student.id === selectedStudent.id ? updatedStudent : student
        )
      );
      setIsEditDrawerOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error("Error updating student:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (student: Student) => {
    if (!confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) {
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setStudents(prev => prev.filter(s => s.id !== student.id));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleBulkDelete = async (selectedStudents: Student[]) => {
    if (!confirm(`Are you sure you want to delete ${selectedStudents.length} students?`)) {
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const idsToDelete = selectedStudents.map(s => s.id);
      setStudents(prev => prev.filter(s => !idsToDelete.includes(s.id)));
    } catch (error) {
      console.error("Error bulk deleting students:", error);
    }
  };

  const handleBulkExport = (selectedStudents: Student[]) => {
    // Convert to CSV
    const headers = ["First Name", "Last Name", "Email", "Grade", "School", "Status"];
    const csvContent = [
      headers.join(","),
      ...selectedStudents.map(student => [
        student.firstName,
        student.lastName,
        student.email,
        student.grade,
        student.school || "",
        student.isActive ? "Active" : "Inactive"
      ].join(","))
    ].join("\n");
    
    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleRowView = (student: Student) => {
    setSelectedStudent(student);
    setIsViewDialogOpen(true);
  };

  const handleRowEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsEditDrawerOpen(true);
  };

  const handleRowDelete = (student: Student) => {
    handleDelete(student);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage student information and records
          </p>
        </div>
        <Button onClick={() => setIsCreateDrawerOpen(true)}>
          Add Student
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={students}
        searchKey="firstName"
        searchPlaceholder="Search students..."
        onRowView={handleRowView}
        onRowEdit={handleRowEdit}
        onRowDelete={handleRowDelete}
        onBulkDelete={handleBulkDelete}
        onBulkExport={handleBulkExport}
      />

      {/* Create Student Drawer */}
      <FormDrawer
        open={isCreateDrawerOpen}
        onOpenChange={setIsCreateDrawerOpen}
        title="Add New Student"
        description="Enter the student's information below"
        schema={studentSchema}
        onSubmit={handleCreate}
        isLoading={isLoading}
      >
        {(form) => (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                name="firstName"
                label="First Name"
                placeholder="Enter first name"
              />
              <FormInput
                name="lastName"
                label="Last Name"
                placeholder="Enter last name"
              />
            </div>
            
            <FormInput
              name="email"
              label="Email"
              type="email"
              placeholder="Enter email address"
            />
            
            <FormInput
              name="phone"
              label="Phone"
              placeholder="Enter phone number"
            />
            
            <FormInput
              name="dateOfBirth"
              label="Date of Birth"
              type="date"
            />
            
            <FormInput
              name="grade"
              label="Grade"
              placeholder="Enter grade level"
            />
            
            <FormInput
              name="school"
              label="School"
              placeholder="Enter school name"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                name="parentName"
                label="Parent Name"
                placeholder="Enter parent name"
              />
              <FormInput
                name="parentPhone"
                label="Parent Phone"
                placeholder="Enter parent phone"
              />
            </div>
            
            <FormInput
              name="parentEmail"
              label="Parent Email"
              type="email"
              placeholder="Enter parent email"
            />
            
            <FormInput
              name="address"
              label="Address"
              placeholder="Enter address"
            />
            
            <FormSelect
              name="programId"
              label="Program"
              options={mockPrograms}
            />
            
            <FormSelect
              name="subProgramId"
              label="Sub Program"
              options={mockSubPrograms}
            />
          </div>
        )}
      </FormDrawer>

      {/* Edit Student Drawer */}
      <FormDrawer
        open={isEditDrawerOpen}
        onOpenChange={setIsEditDrawerOpen}
        title="Edit Student"
        description="Update the student's information"
        schema={studentSchema}
        defaultValues={selectedStudent ? {
          firstName: selectedStudent.firstName,
          lastName: selectedStudent.lastName,
          email: selectedStudent.email,
          phone: selectedStudent.phone || "",
          dateOfBirth: selectedStudent.dateOfBirth.toISOString().split('T')[0],
          grade: selectedStudent.grade,
          school: selectedStudent.school || "",
          parentName: selectedStudent.parentName || "",
          parentPhone: selectedStudent.parentPhone || "",
          parentEmail: selectedStudent.parentEmail || "",
          address: selectedStudent.address || "",
          programId: selectedStudent.programId || "",
          subProgramId: selectedStudent.subProgramId || "",
        } : undefined}
        onSubmit={handleEdit}
        isLoading={isLoading}
      >
        {(form) => (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                name="firstName"
                label="First Name"
                placeholder="Enter first name"
              />
              <FormInput
                name="lastName"
                label="Last Name"
                placeholder="Enter last name"
              />
            </div>
            
            <FormInput
              name="email"
              label="Email"
              type="email"
              placeholder="Enter email address"
            />
            
            <FormInput
              name="phone"
              label="Phone"
              placeholder="Enter phone number"
            />
            
            <FormInput
              name="dateOfBirth"
              label="Date of Birth"
              type="date"
            />
            
            <FormInput
              name="grade"
              label="Grade"
              placeholder="Enter grade level"
            />
            
            <FormInput
              name="school"
              label="School"
              placeholder="Enter school name"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                name="parentName"
                label="Parent Name"
                placeholder="Enter parent name"
              />
              <FormInput
                name="parentPhone"
                label="Parent Phone"
                placeholder="Enter parent phone"
              />
            </div>
            
            <FormInput
              name="parentEmail"
              label="Parent Email"
              type="email"
              placeholder="Enter parent email"
            />
            
            <FormInput
              name="address"
              label="Address"
              placeholder="Enter address"
            />
            
            <FormSelect
              name="programId"
              label="Program"
              options={mockPrograms}
            />
            
            <FormSelect
              name="subProgramId"
              label="Sub Program"
              options={mockSubPrograms}
            />
          </div>
        )}
      </FormDrawer>

      {/* View Student Dialog */}
      <FormDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        title="Student Details"
        description="View student information"
        schema={z.object({})}
        onSubmit={() => {}}
        submitLabel="Close"
        cancelLabel=""
      >
        {() => (
          <div className="space-y-4">
            {selectedStudent && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">First Name</label>
                  <p className="text-sm">{selectedStudent.firstName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Name</label>
                  <p className="text-sm">{selectedStudent.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm">{selectedStudent.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-sm">{selectedStudent.phone || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Grade</label>
                  <p className="text-sm">{selectedStudent.grade}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">School</label>
                  <p className="text-sm">{selectedStudent.school || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Parent Name</label>
                  <p className="text-sm">{selectedStudent.parentName || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Parent Phone</label>
                  <p className="text-sm">{selectedStudent.parentPhone || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Parent Email</label>
                  <p className="text-sm">{selectedStudent.parentEmail || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-sm">{selectedStudent.address || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Enrollment Date</label>
                  <p className="text-sm">{selectedStudent.enrollmentDate?.toLocaleDateString() || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="text-sm">
                    <Badge variant={selectedStudent.isActive ? "default" : "secondary"}>
                      {selectedStudent.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </FormDialog>
    </div>
  );
}
