'use client';

import ApplicationsViewPage from "@/components/applications/ApplicationsViewPage";
import {USER_ROLE} from "@/utils/constants";


const SalesCoachDashboard = () => {
    return <ApplicationsViewPage role={USER_ROLE.SALES_COACH}/>;

};

export default SalesCoachDashboard;