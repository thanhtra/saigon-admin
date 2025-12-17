import { post } from '@/utils/request';
import { FacebookPageTokenUpdate } from '@/utils/type';
import { useCallback } from 'react';


const useUpdateFacebookPageToken = () => {
    const updateFacebookPageToken = useCallback(
        async (page: FacebookPageTokenUpdate) => {
            try {
                const res = await post('/facebook-page/update-token', page);
                return res;
            } catch (error) {
                console.error('Error updating token:', error);
                throw error;
            }
        },
        []
    );

    return { updateFacebookPageToken };
};

export default useUpdateFacebookPageToken;
