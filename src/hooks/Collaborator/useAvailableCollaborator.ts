import { useCallback, useState } from 'react';
import { get } from '@/utils/request';


export type CollaboratorUser = {
    id: string;
    name: string;
    phone: string;
};

const useAvailableCollaboratorUsers = () => {
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<SelectOption<string>[]>([]);

    const fetchUsers = useCallback(async () => {
        setLoading(true);

        try {
            const res = await get('/admin/users/available-collaborator');

            if (res?.success) {
                const mapped: SelectOption<string>[] =
                    res.result.map((u: CollaboratorUser) => ({
                        label: `${u.name} - ${u.phone}`,
                        value: u.id,
                        raw: u,
                    }));

                setOptions(mapped);
            } else {
                setOptions([]);
            }

            return res;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        fetchUsers,
        options,
        loading,
    };
};

export default useAvailableCollaboratorUsers;
