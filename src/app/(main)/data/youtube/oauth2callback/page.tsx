'use client';

import useUpdateTokenYoutube from '@/hooks/Youtube/useUpdateTokenYoutube';
import { YoutubeUpdateToken } from '@/utils/type';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function YoutubeCallback() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { updateTokenYoutube } = useUpdateTokenYoutube();

    useEffect(() => {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        let youtubeid: string | undefined;

        try {
            if (state) {
                const parsedState = JSON.parse(state);
                youtubeid = parsedState?.youtubeid;
            }
        } catch (error) {
            toast.error('Lỗi khi phân tích state từ Google!');
            router.push('/data/youtube');
            return;
        }

        if (!code || !youtubeid) {
            toast.error('Thiếu mã code hoặc youtubeid!');
            return;
        }

        const fetchToken = async () => {
            try {
                const payload: YoutubeUpdateToken = {
                    code,
                    id: youtubeid
                };
                const res = await updateTokenYoutube(payload);

                if (res?.success) {
                    toast.success('Cập nhật token thành công!');
                } else {
                    toast.error(res?.message || 'Lỗi khi cập nhật token!');
                }

                router.push(`/data/youtube`);
            } catch (err) {
                toast.error(`Lỗi không xác định: ${JSON.stringify(err)}`);
                router.push(`/data/youtube`);
            }
        };

        fetchToken();
    }, []);

    return <p>Đang xử lý cập nhật token...</p>;
}
