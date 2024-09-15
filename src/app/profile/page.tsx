"use client"
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import {USER_ROLE} from "@/utils/constants";
import useAuthenticatedUserInfo from "@/hooks/useAuthenticatedUserInfo";
import Loading from "@/components/Loading";
import PageLayout from "@/components/PageLayout";
import ApplicationsViewPage from "@/components/applications/ApplicationsViewPage";
import ProfileView from "@/components/profile/ProfileView";


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

    return <RoleProtectedRoute role={USER_ROLE.SALES_AGENT}>
        <PageLayout>
            <ProfileView/>
        </PageLayout>
    </RoleProtectedRoute>
}