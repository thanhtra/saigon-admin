// hooks/User/useUpdateUser.ts
import { put } from '@/utils/request';
import { User } from '@/types/user';
import { useCallback, useState } from 'react';

const useUpdateUser = () => {
    const [loading, setLoading] = useState(false);

    const updateUser = useCallback(async (id: string, body: User) => {
        setLoading(true);
        try {
            return await put(`/users/${id}`, body);
        } finally {
            setLoading(false);
        }
    }, []);

    return { updateUser, loading };
};

export default useUpdateUser;
