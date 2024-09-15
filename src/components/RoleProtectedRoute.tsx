"use client";
import {redirect} from 'next/navigation';
import {ReactNode} from 'react';
import {UserRole} from "@/types/user";
import {useAuth} from "@/context/AuthContext";

interface RoleProtectedRouteProps {
    role: UserRole;
    children: ReactNode;
}

const RoleProtectedRoute = ({role, children}: RoleProtectedRouteProps) => {
    const {userInfo} = useAuth();

    if (!userInfo || userInfo.role !== role) {
        redirect('/');
    }

    return <>{children}</>;
};

export default RoleProtectedRoute;