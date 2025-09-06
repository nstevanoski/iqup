"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useUser } from "@/store/auth";
import { RoleBasedDashboard, DashboardMetrics, DashboardActivity } from "@/types";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  ShoppingCart,
  Package,
  CheckCircle,
  Clock,
  Activity,
  BarChart3,
  Award,
  Building,
  UserCheck,
  Zap
} from "lucide-react";

// Sample dashboard data for different roles
const hqDashboardData: RoleBasedDashboard = {
  role: "HQ",
  metrics: {
    totalStudents: 1250,
    activeStudents: 980,
    totalTeachers: 85,
    activeTeachers: 72,
    totalPrograms: 12,
    totalRevenue: 1250000,
    monthlyRevenue: 125000,
    completionRate: 78.5,
    averageProgress: 65.2,
    totalLearningGroups: 45,
    activeLearningGroups: 38,
    totalTrainings: 24,
    upcomingTrainings: 6,
    totalOrders: 156,
    pendingOrders: 12,
    totalProducts: 48,
    lowStockProducts: 3,
  },
  charts: {
    revenue: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{
        label: "Revenue",
        data: [95000, 110000, 105000, 125000, 130000, 125000],
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "rgba(59, 130, 246, 1)",
      }],
    },
    studentProgress: {
      labels: ["0-25%", "26-50%", "51-75%", "76-100%"],
      datasets: [{
        label: "Students",
        data: [120, 280, 350, 230],
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderColor: "rgba(34, 197, 94, 1)",
      }],
    },
    enrollmentTrends: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{
        label: "New Enrollments",
        data: [45, 52, 48, 61, 58, 55],
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        borderColor: "rgba(168, 85, 247, 1)",
      }],
    },
    programDistribution: {
      labels: ["English", "Spanish", "French", "German", "Other"],
      datasets: [{
        label: "Students",
        data: [450, 320, 180, 95, 105],
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
      }],
    },
  },
  activities: [
    {
      id: "act_1",
      type: "enrollment",
      title: "New Student Enrollment",
      description: "Alice Johnson enrolled in Business English program",
      timestamp: new Date("2024-01-20T10:30:00"),
      user: "Boston Learning Center",
      status: "success",
    },
    {
      id: "act_2",
      type: "payment",
      title: "Payment Received",
      description: "Payment of $1,200 received from Bob Smith",
      timestamp: new Date("2024-01-20T09:15:00"),
      amount: 1200,
      status: "success",
    },
    {
      id: "act_3",
      type: "training",
      title: "Training Completed",
      description: "Teacher Training: Advanced Teaching Methods completed",
      timestamp: new Date("2024-01-19T16:45:00"),
      user: "Sarah Wilson",
      status: "success",
    },
  ],
  widgets: [],
  quickActions: [
    {
      id: "qa_1",
      title: "Create Program",
      description: "Add a new educational program",
      icon: "BookOpen",
      href: "/programs/new",
      color: "blue",
    },
    {
      id: "qa_2",
      title: "View Reports",
      description: "Access comprehensive reports",
      icon: "BarChart3",
      href: "/reports/royalties",
      color: "green",
    },
    {
      id: "qa_3",
      title: "Manage Accounts",
      description: "Create and manage MF/LC accounts",
      icon: "Building",
      href: "/accounts",
      color: "purple",
    },
    {
      id: "qa_4",
      title: "System Settings",
      description: "Configure system preferences",
      icon: "Zap",
      href: "/settings",
      color: "orange",
    },
  ],
};

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case "success": return "text-green-600 bg-green-100";
    case "warning": return "text-yellow-600 bg-yellow-100";
    case "error": return "text-red-600 bg-red-100";
    case "info": return "text-blue-600 bg-blue-100";
    default: return "text-gray-600 bg-gray-100";
  }
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case "enrollment": return Users;
    case "graduation": return GraduationCap;
    case "payment": return DollarSign;
    case "training": return BookOpen;
    case "order": return ShoppingCart;
    case "system": return Zap;
    default: return Activity;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export default function DashboardPage() {
  const user = useUser();
  const [dashboardData, setDashboardData] = useState<RoleBasedDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // In a real app, this would make an API call based on user role
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        let data: RoleBasedDashboard;
        switch (user?.role) {
          case "HQ":
            data = hqDashboardData;
            break;
          case "MF":
            data = {
              role: "MF",
              metrics: {
                totalStudents: 450,
                activeStudents: 380,
                totalTeachers: 25,
                activeTeachers: 22,
                totalPrograms: 8,
                totalRevenue: 450000,
                monthlyRevenue: 45000,
                completionRate: 82.3,
                averageProgress: 68.7,
                totalLearningGroups: 18,
                activeLearningGroups: 15,
                totalTrainings: 8,
                upcomingTrainings: 2,
                totalOrders: 45,
                pendingOrders: 3,
                totalProducts: 24,
                lowStockProducts: 1,
              },
              charts: hqDashboardData.charts,
              activities: [
                {
                  id: "act_1",
                  type: "enrollment",
                  title: "New Student Enrollment",
                  description: "Carol Davis enrolled in Academic English program",
                  timestamp: new Date("2024-01-20T11:15:00"),
                  user: "Somerville Learning Center",
                  status: "success",
                },
                {
                  id: "act_2",
                  type: "payment",
                  title: "Payment Received",
                  description: "Payment of $800 received from David Wilson",
                  timestamp: new Date("2024-01-20T08:30:00"),
                  amount: 800,
                  status: "success",
                },
              ],
              widgets: [],
              quickActions: [
                {
                  id: "qa_1",
                  title: "Create SubProgram",
                  description: "Add a new subprogram",
                  icon: "BookOpen",
                  href: "/subprograms/new",
                  color: "blue",
                },
                {
                  id: "qa_2",
                  title: "View Orders",
                  description: "Manage product orders",
                  icon: "ShoppingCart",
                  href: "/orders",
                  color: "green",
                },
                {
                  id: "qa_3",
                  title: "Create Training",
                  description: "Schedule new training session",
                  icon: "GraduationCap",
                  href: "/trainings/new",
                  color: "purple",
                },
                {
                  id: "qa_4",
                  title: "View Reports",
                  description: "Access regional reports",
                  icon: "BarChart3",
                  href: "/reports/students",
                  color: "orange",
                },
              ],
            };
            break;
          case "LC":
            data = {
              role: "LC",
              metrics: {
                totalStudents: 120,
                activeStudents: 95,
                totalTeachers: 8,
                activeTeachers: 7,
                totalPrograms: 4,
                totalRevenue: 120000,
                monthlyRevenue: 12000,
                completionRate: 85.2,
                averageProgress: 72.1,
                totalLearningGroups: 6,
                activeLearningGroups: 5,
                totalTrainings: 3,
                upcomingTrainings: 1,
                totalOrders: 12,
                pendingOrders: 1,
                totalProducts: 15,
                lowStockProducts: 2,
              },
              charts: hqDashboardData.charts,
              activities: [
                {
                  id: "act_1",
                  type: "enrollment",
                  title: "New Student Enrollment",
                  description: "Emma Thompson enrolled in Business English program",
                  timestamp: new Date("2024-01-20T13:20:00"),
                  user: "Boston Learning Center",
                  status: "success",
                },
                {
                  id: "act_2",
                  type: "graduation",
                  title: "Student Graduated",
                  description: "Michael Brown completed Spanish Language program",
                  timestamp: new Date("2024-01-19T16:00:00"),
                  user: "Boston Learning Center",
                  status: "success",
                },
              ],
              widgets: [],
              quickActions: [
                {
                  id: "qa_1",
                  title: "Add Student",
                  description: "Enroll a new student",
                  icon: "Users",
                  href: "/contacts/students/new",
                  color: "blue",
                },
                {
                  id: "qa_2",
                  title: "Create Learning Group",
                  description: "Start a new learning group",
                  icon: "BookOpen",
                  href: "/learning-groups/new",
                  color: "green",
                },
                {
                  id: "qa_3",
                  title: "Place Order",
                  description: "Order products and materials",
                  icon: "ShoppingCart",
                  href: "/orders/new",
                  color: "purple",
                },
                {
                  id: "qa_4",
                  title: "View Progress",
                  description: "Check student progress",
                  icon: "TrendingUp",
                  href: "/reports/students",
                  color: "orange",
                },
              ],
            };
            break;
          case "TT":
            data = {
              role: "TT",
              metrics: {
                totalStudents: 0,
                activeStudents: 0,
                totalTeachers: 45,
                activeTeachers: 42,
                totalPrograms: 0,
                totalRevenue: 0,
                monthlyRevenue: 0,
                completionRate: 88.9,
                averageProgress: 0,
                totalLearningGroups: 0,
                activeLearningGroups: 0,
                totalTrainings: 12,
                upcomingTrainings: 3,
                totalOrders: 0,
                pendingOrders: 0,
                totalProducts: 0,
                lowStockProducts: 0,
              },
              charts: hqDashboardData.charts,
              activities: [
                {
                  id: "act_1",
                  type: "training",
                  title: "Training Completed",
                  description: "Sarah Wilson completed Advanced Teaching Methods training",
                  timestamp: new Date("2024-01-20T15:30:00"),
                  user: "Sarah Wilson",
                  status: "success",
                },
                {
                  id: "act_2",
                  type: "training",
                  title: "Training Scheduled",
                  description: "Classroom Management training scheduled for next week",
                  timestamp: new Date("2024-01-19T10:00:00"),
                  user: "John Brown",
                  status: "info",
                },
              ],
              widgets: [],
              quickActions: [
                {
                  id: "qa_1",
                  title: "View Trainings",
                  description: "See assigned training sessions",
                  icon: "GraduationCap",
                  href: "/trainings",
                  color: "blue",
                },
                {
                  id: "qa_2",
                  title: "Mark Progress",
                  description: "Update teacher training progress",
                  icon: "UserCheck",
                  href: "/teacher-trainers",
                  color: "green",
                },
                {
                  id: "qa_3",
                  title: "Generate Certificates",
                  description: "Create completion certificates",
                  icon: "Award",
                  href: "/trainings/certificates",
                  color: "purple",
                },
                {
                  id: "qa_4",
                  title: "View Reports",
                  description: "Access training reports",
                  icon: "BarChart3",
                  href: "/reports/trainings",
                  color: "orange",
                },
              ],
            };
            break;
          default:
            data = hqDashboardData; // Default to HQ
        }
        
        setDashboardData(data);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Please log in</h3>
            <p className="mt-1 text-sm text-gray-500">You need to be logged in to view the dashboard.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading || !dashboardData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Loading Dashboard</h3>
            <p className="mt-1 text-sm text-gray-500">Please wait while we load your data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const { metrics, activities, quickActions, role } = dashboardData;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {role} Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {user.name}! Here's what's happening in your {role.toLowerCase()} operations.
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {formatDate(new Date())}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {role !== "TT" && (
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-2xl font-semibold text-gray-900">{metrics.totalStudents}</p>
                    <p className="text-sm text-green-600">
                      {metrics.activeStudents} active
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <GraduationCap className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Teachers</p>
                    <p className="text-2xl font-semibold text-gray-900">{metrics.totalTeachers}</p>
                    <p className="text-sm text-green-600">
                      {metrics.activeTeachers} active
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">{formatCurrency(metrics.monthlyRevenue)}</p>
                    <p className="text-sm text-gray-500">
                      Total: {formatCurrency(metrics.totalRevenue)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">{metrics.completionRate}%</p>
                    <p className="text-sm text-gray-500">
                      Avg Progress: {metrics.averageProgress}%
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {role === "TT" && (
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <GraduationCap className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                    <p className="text-2xl font-semibold text-gray-900">{metrics.totalTeachers}</p>
                    <p className="text-sm text-green-600">
                      {metrics.activeTeachers} active
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BookOpen className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Trainings</p>
                    <p className="text-2xl font-semibold text-gray-900">{metrics.totalTrainings}</p>
                    <p className="text-sm text-blue-600">
                      {metrics.upcomingTrainings} upcoming
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">{metrics.completionRate}%</p>
                    <p className="text-sm text-gray-500">
                      Training success rate
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Award className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Certificates</p>
                    <p className="text-2xl font-semibold text-gray-900">42</p>
                    <p className="text-sm text-gray-500">
                      Generated this month
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Additional Metrics for Non-TT Roles */}
        {role !== "TT" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Learning Groups</p>
                <p className="text-2xl font-semibold text-gray-900">{metrics.totalLearningGroups}</p>
                <p className="text-sm text-green-600">
                  {metrics.activeLearningGroups} active
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-pink-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Trainings</p>
                <p className="text-2xl font-semibold text-gray-900">{metrics.totalTrainings}</p>
                <p className="text-sm text-blue-600">
                  {metrics.upcomingTrainings} upcoming
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingCart className="h-8 w-8 text-teal-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{metrics.totalOrders}</p>
                <p className="text-sm text-yellow-600">
                  {metrics.pendingOrders} pending
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Products</p>
                <p className="text-2xl font-semibold text-gray-900">{metrics.totalProducts}</p>
                {metrics.lowStockProducts > 0 && (
                  <p className="text-sm text-red-600">
                    {metrics.lowStockProducts} low stock
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {activities.map((activity) => {
                    const IconComponent = getActivityIcon(activity.type);
                    return (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className={`p-2 rounded-full ${getStatusColor(activity.status || "info")}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-500">{activity.description}</p>
                          <div className="flex items-center mt-1 text-xs text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(activity.timestamp)}
                            {activity.user && (
                              <>
                                <span className="mx-2">•</span>
                                {activity.user}
                              </>
                            )}
                            {activity.amount && (
                              <>
                                <span className="mx-2">•</span>
                                {formatCurrency(activity.amount)}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {quickActions.map((action) => {
                    const IconComponent = action.icon === "BookOpen" ? BookOpen :
                                        action.icon === "BarChart3" ? BarChart3 :
                                        action.icon === "Building" ? Building :
                                        action.icon === "Zap" ? Zap :
                                        Activity;
                    
                    return (
                      <a
                        key={action.id}
                        href={action.href}
                        className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-full bg-blue-100">
                            <IconComponent className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{action.title}</p>
                            <p className="text-xs text-gray-500">{action.description}</p>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}