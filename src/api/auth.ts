import axios from 'axios';
import {BASE_URL} from '@/api/config';

export const getVerifyToken = async ({token}: { token: string }): Promise<boolean> => {
    try {
        const response = await axios.get(`${BASE_URL}/api/v1/auth/verifyToken`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.status === 200;
    } catch (error) {
        return false;
    }
};

export const postLogin = async ({email, password}: { email: string, password: string }): Promise<{token: string | null, message: {
        title: string,
        description: string
    }}> => {
    try {
        const response = await axios.post(`${BASE_URL}/api/v1/auth/login`, {email, password});
        return response.data.response.data[0];
    } catch (error: any) {
        return error.response.data.response.data[0];
    }
};