"use client";
import {redirect} from 'next/navigation';
import {ReactNode, useEffect, useState} from 'react';
import useVerifyToken from "@/hooks/useVerifyToken";
import Loading from "@/components/Loading";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({children}: ProtectedRouteProps) => {
    const {data, isLoading} = useVerifyToken();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient && !isLoading && !data) {
            localStorage.removeItem('UserToken');
            redirect('/');
        }
    }, [data, isLoading, isClient]);

    if (!isClient || isLoading) {
        return <Loading/>
    }

    if (!data) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;