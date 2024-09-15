"use client"
import ProtectedRoute from "@/components/ProtectedRoute";
import {USER_ROLE} from "@/utils/constants";
import useAuthenticatedUserInfo from "@/hooks/useAuthenticatedUserInfo";
import Loading from "@/components/Loading";
import PageLayout from "@/components/PageLayout";
import ApplicationsViewPage from "@/components/applications/ApplicationsViewPage";


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
        <ApplicationsViewPage role={data.role}/>
    </PageLayout>

}