import { useQuery } from "react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Users, UserCheck, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getDashboardData } from "@/api/user";
import { Application } from "@/types/application";
import { formatDate } from "@/utils/formatDateAndTime";
import Loading from "@/components/Loading";
import { useEffect } from "react";

const AdminDashboard = () => {
  const { userToken } = useAuth();

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery(
    ["dashboardData", userToken],
    () => getDashboardData({ token: userToken }),
    {
      enabled: !!userToken,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    console.log("dashboardData", dashboardData);
  }, [dashboardData]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: An error occurred while fetching dashboard data.</div>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <main className="flex flex-1 flex-col gap-8 p-4 md:gap-12 md:p-10">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Sales Coaches
              </CardTitle>
              <Users className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData?.totalSalesCoaches}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Sales Agents
              </CardTitle>
              <UserCheck className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData?.totalSalesAgents}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Applications
              </CardTitle>
              <FileText className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData?.totalApplications}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Incomplete Applications This Week</CardTitle>
          </CardHeader>
          <div style={{ height: "500px", overflow: "auto" }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>CPR</TableHead>
                  <TableHead>Date Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData?.incompleteApplicationsThisWeek.map(
                  (app: Application, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{app.first_name}</TableCell>
                      <TableCell>{app.last_name}</TableCell>
                      <TableCell>{app.mobile}</TableCell>
                      <TableCell>{app.cpr}</TableCell>
                      <TableCell>{formatDate(app.date_submitted)}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
