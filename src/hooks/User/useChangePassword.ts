import { put } from '@/utils/request';
import { useCallback, useState } from 'react';

interface ChangePassworDto {
    old_password: string;
    new_password: string;
}

const useChangePassword = () => {
    const [loading, setLoading] = useState(false);

    const changePassword = useCallback(
        async (body: ChangePassworDto): Promise<any> => {
            setLoading(true);
            try {
                return await put(`/auth/change-password`, body);
            } catch (error) {
                console.error('Error changePassword: ', error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    return { changePassword, loading };
};

export default useChangePassword;
