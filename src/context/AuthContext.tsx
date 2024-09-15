import {createContext, ReactNode, useContext, useMemo, useState} from "react";
import {useLocalStorage} from "@/hooks/useLocalStorage";
import {User} from "@/types/user";
import {redirect} from "next/navigation";
import {useQueryClient} from "react-query";

interface AuthContextType {
    userToken: string;
    setUserToken: (token: string) => void;
    isAuthenticated: boolean;
    userInfo: User | null;
    setUserInfo: (userInfo: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const queryClient = useQueryClient();
    const [userToken, setUserToken] = useLocalStorage('token', '', false);
    const [userInfo, setUserInfo] = useState<User | null>(null);

    const isAuthenticated = useMemo(() => !!userToken, [userToken]);

    const logout = () => {
        setUserToken('');
        setUserInfo(null);
        localStorage.clear();

        queryClient.clear();

        redirect('/');
    };

    const value: AuthContextType = {
        userToken,
        setUserToken,
        isAuthenticated,
        userInfo,
        setUserInfo,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};