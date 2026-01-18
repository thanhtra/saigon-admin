import { get } from '@/utils/request';
import { useCallback, useState } from 'react';


const useGetRentalsByCollaborator = () => {
    const [loading, setLoading] = useState(false);

    const getRentalsByCollaborator = useCallback(
        async (params: {
            collaborator_id: string;
            active?: boolean;
        }) => {
            setLoading(true);
            try {
                return await get('/rentals/by-collaborator/admintra', params);
            } catch (error) {
                console.log('Error getRentalsByCollaborator: ', error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    return { getRentalsByCollaborator, loading };
};

export default useGetRentalsByCollaborator;
