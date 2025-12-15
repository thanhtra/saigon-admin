'use client';

import { CardItem, TitleMain } from '@/styles/common';
import { post } from '@/utils/apiClient';
import { Button } from '@mui/material';
import { useState } from 'react';

export default function PostVideoPage() {
    const [status, setStatus] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handlePostVideos = async () => {
        setLoading(true);
        setStatus(['⏳ Đang đăng video...']);

        try {
            const res = await post('/youtube/post-videos', {});

            if (res?.success) {
                if (Array.isArray(res.result) && res.result.length > 0) {
                    setStatus(prev => [
                        ...prev,
                        ...res.result.map((item: any) => `✅ ${item}`),
                        '🎉 Hoàn tất đăng video!',
                    ]);
                } else {
                    setStatus(prev => [...prev, '✅ Hoàn tất đăng video!']);
                }
            } else {
                setStatus(prev => [...prev, `❌ Thất bại: ${res?.message}`]);
            }
        } catch (err: any) {
            setStatus(prev => [...prev, `❌ Lỗi hệ thống: ${err.message}`]);
        } finally {
            setLoading(false);
        }
    };

    return (<>
        <TitleMain>Đăng video TikTok lên Youtube</TitleMain>
        <CardItem>
            <Button variant="contained" onClick={handlePostVideos} disabled={loading} sx={{ mt: 2 }}>
                {loading ? 'Đang xử lý...' : 'Đăng video lên Youtube'}
            </Button>

            <ul style={{ marginTop: 20 }}>
                {status.map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                ))}
            </ul>
        </CardItem>
    </>

    );
}
