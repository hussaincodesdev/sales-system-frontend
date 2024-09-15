import {createContext, ReactNode, useContext, useState} from "react";

interface AppContextType {
    isLoading: boolean;
    setIsLoading: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({children}: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const value: AppContextType = {
        isLoading,
        setIsLoading,
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp= () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AppProvider");
    }
    return context;
};