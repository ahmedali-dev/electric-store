import useAxiosPrivate from './useAxiosPrivate';
import useAuth from './useAuth';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';
const useLogout = () => {
 const [logout, setLogout] = useState(false);
    const axios = useAxiosPrivate();
    const auth = useAuth();
    const logoutMutation = useMutation({
        mutationFn: async () => await axios.post('/auth/logout'),
        onSuccess: () => {
            auth.logout();
        },
        onError: (err) => {
            const res = err?.response?.data;
            toast.error(res?.message || "UnExpected Error")
            auth.login();
        }
    })



    return {state: {logout, setLogout}, logoutMutation}
}

export default useLogout