'use client';

import useUpdateTokenPinterest from '@/hooks/Pinterest/useUpdateTokenPinterest';
import { PinterestUpdateToken } from '@/utils/type';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function YoutubeCallback() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { updateTokenPinterest } = useUpdateTokenPinterest();

    useEffect(() => {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        let pinterestid: string | undefined;

        try {
            if (state) {
                const parsedState = JSON.parse(state);
                pinterestid = parsedState?.pinterestid;
            }
        } catch (error) {
            toast.error('Lỗi khi phân tích state từ Google!');
            router.push('/pinterest/pinterest-account');
            return;
        }

        if (!code || !pinterestid) {
            toast.error('Thiếu mã code hoặc pinterestid!');
            return;
        }

        const fetchToken = async () => {
            try {
                const payload: PinterestUpdateToken = {
                    code,
                    id: pinterestid
                };
                const res = await updateTokenPinterest(payload);

                if (res?.success) {
                    toast.success('Cập nhật token thành công!');
                } else {
                    toast.error(res?.message || 'Lỗi khi cập nhật token!');
                }
                router.push(`/pinterest/pinterest-account`);
            } catch (err) {
                toast.error(`Lỗi không xác định: ${JSON.stringify(err)}`);
                router.push(`/pinterest/pinterest-account`);
            }
        };

        fetchToken();
    }, []);

    return <p>Đang xử lý cập nhật token...</p>;
}
