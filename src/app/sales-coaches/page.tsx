"use client"
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import {USER_ROLE} from "@/utils/constants";
import useAuthenticatedUserInfo from "@/hooks/useAuthenticatedUserInfo";
import Loading from "@/components/Loading";
import PageLayout from "@/components/PageLayout";
import SalesCoachesViewPage from "@/components/sales-coaches/SalesCoachesViewPage";


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

    return <RoleProtectedRoute role={USER_ROLE.ADMIN}>
        <PageLayout>
            <SalesCoachesViewPage/>
        </PageLayout>
    </RoleProtectedRoute>
}