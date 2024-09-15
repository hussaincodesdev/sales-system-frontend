"use client";
import SalesAgentDashboard from "@/components/dashboard/SalesAgentDashboard";
import Loading from "@/components/Loading";
import PageLayout from "@/components/PageLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import useAuthenticatedUserInfo from "@/hooks/useAuthenticatedUserInfo";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import SalesCoachDashboard from "@/components/dashboard/SalesCoachDashboard";

export default function Component() {
    return <ProtectedRoute>
        <Dashboard/>
    </ProtectedRoute>
}


const Dashboard = () => {
    const {data, isLoading} = useAuthenticatedUserInfo();

    if (isLoading) {
        return <Loading/>
    }

    if (!data) return null;

    return (<PageLayout>
        {data.role === "admin" && <AdminDashboard/>}
        {data.role === "sales_agent" && <SalesAgentDashboard/>}
        {data.role === "sales_coach" && <SalesCoachDashboard/>}
    </PageLayout>);
}