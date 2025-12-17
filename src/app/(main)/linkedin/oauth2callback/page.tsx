'use client';

import useUpdateTokenLinkedIn from '@/hooks/AccountLinkedin/useUpdateTokenLinkedIn';
import { LinkedInUpdateToken } from '@/utils/type';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function LinkedinCallback() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { updateTokenLinkedIn } = useUpdateTokenLinkedIn();

    useEffect(() => {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        let linkedinId: string | undefined;

        try {
            if (state) {
                const parsedState = JSON.parse(state);
                linkedinId = parsedState?.linkedinId;
            }
        } catch (error) {
            toast.error('Lỗi khi phân tích state từ LinkedIn!');
            router.push('/linkedin/account');
            return;
        }

        if (!code || !linkedinId) {
            toast.error('Thiếu mã code hoặc linkedinId!');
            return;
        }

        const fetchToken = async () => {
            try {
                const payload: LinkedInUpdateToken = {
                    code,
                    id: linkedinId
                };
                const res = await updateTokenLinkedIn(payload);

                if (res?.success) {
                    toast.success('Cập nhật token thành công!');
                } else {
                    toast.error(res?.message || 'Lỗi khi cập nhật token!');
                }

                router.push(`/linkedin/account`);
            } catch (err) {
                toast.error(`Lỗi không xác định: ${JSON.stringify(err)}`);
                router.push(`/linkedin/account`);
            }
        };

        fetchToken();
    }, []);

    return <p>Đang xử lý cập nhật token...</p>;
}
