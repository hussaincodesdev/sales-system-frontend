import {useQuery} from 'react-query';
import {useAuth} from '@/context/AuthContext';
import {getUserInfo} from "@/api/user";

const useAuthenticatedUserInfo = () => {
    const {userToken, setUserInfo, logout} = useAuth();

    return useQuery(['user'], () => getUserInfo({token: userToken}), {
        enabled: !!userToken,
        retry: false,
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
            if (data) {
                setUserInfo(data);
            } else {
                logout();
            }
        },
    });
};

export default useAuthenticatedUserInfo;