import { User } from '@/common/type';
import { put } from '@/utils/request';
import { useCallback, useState } from 'react';

const useUpdateUser = () => {
    const [loading, setLoading] = useState(false);

    const updateUser = useCallback(async (id: string, body: User): Promise<any> => {
        setLoading(true);
        try {
            return await put(`/users/${id}/admintra`, body);
        } catch (error) {
            console.log('Error updateUser: ', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { updateUser, loading };
};

export default useUpdateUser;