import { post } from '@/utils/apiClient';
import { GroupFacebookPayload } from '@/utils/type';
import { useCallback } from 'react';


const useCreateGroupFacebook = () => {
    const createGroupFacebook = useCallback(async (payload: GroupFacebookPayload) => {
        try {
            const res = await post('/group-facebook', payload);
            return res;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, []);

    return { createGroupFacebook };
};

export default useCreateGroupFacebook;
