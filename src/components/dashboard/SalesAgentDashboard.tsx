'use client';

import ApplicationsViewPage from "@/components/applications/ApplicationsViewPage";
import {USER_ROLE} from "@/utils/constants";


const SalesAgentDashboard = () => {
    return <ApplicationsViewPage role={USER_ROLE.SALES_AGENT}/>;

};

export default SalesAgentDashboard;