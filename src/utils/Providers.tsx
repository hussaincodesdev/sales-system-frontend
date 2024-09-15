"use client"

import {AuthProvider} from "@/context/AuthContext";
import {ReactNode} from "react";
import {QueryClient, QueryClientProvider} from "react-query";
import {AppProvider} from "@/context/AppContext";

export const Providers = ({children}: { children: ReactNode }) => {
    const queryClient = new QueryClient();

    return (<QueryClientProvider client={queryClient}>
        <AppProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </AppProvider>
    </QueryClientProvider>)
}