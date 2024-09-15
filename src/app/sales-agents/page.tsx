"use client"
import ProtectedRoute from "@/components/ProtectedRoute";
import useAuthenticatedUserInfo from "@/hooks/useAuthenticatedUserInfo";
import Loading from "@/components/Loading";
import PageLayout from "@/components/PageLayout";
import SalesAgentsViewPage from "@/components/sales-agents/SalesAgentsViewPage";


export default function Component() {
    return <ProtectedRoute>
        <Page/>
    </ProtectedRoute>
}

const Page = () => {
    const {data, isLoading} = useAuthenticatedUserInfo();

    if (isLoading) {
        return <Loading/>
    }

    if (!data) return null;

    return <PageLayout>
        <SalesAgentsViewPage role={data.role}/>
    </PageLayout>
}