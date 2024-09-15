import {useQuery} from 'react-query';
import {useAuth} from '@/context/AuthContext';
import {getVerifyToken} from "@/api/auth";

const useVerifyToken = () => {
    const {userToken} = useAuth();

    return useQuery('verifyToken', () => getVerifyToken({token: userToken}), {
        enabled: !!userToken,
        retry: false,
        refetchOnWindowFocus: false,
        onError: () => {
            localStorage.removeItem('token');
        },
    });
};

export default useVerifyToken;