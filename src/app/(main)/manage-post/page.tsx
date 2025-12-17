'use client';

import { CardItem, TitleMain, TitleSub } from '@/styles/common';
import { post } from '@/utils/request';
import { Button } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';



export default function PostVideoPage() {
    const [status, setStatus] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handlePostVideos = async () => {
        setLoading(true);
        setStatus(['⏳ Đang đăng video...']);

        try {
            const res = await post('/facebook-page/post-video-page', {});

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

    const fanpagePostGroup = async () => {
        try {
            const res = await post('/manage-post/fanpage-post-group', {});
        } catch (error) {
            console.error('Error posting to group:', JSON.stringify(error));
        }
    }

    const fanpagePostShopee = async () => {
        try {
            await post('/facebook-page/fanpage-post-shopee', {});
        } catch (error) {
            console.error('Error posting to group:', JSON.stringify(error));
        }
    }

    const uploadShopeeToYoutube = async () => {
        try {
            await post('/youtube/post-shopee', {});
        } catch (error) {
            console.error('Error posting shopee to youtube:', JSON.stringify(error));
        }
    }

    const uploadShopeeToLinkedIn = async () => {
        try {
            await post('/linkedin-account/post-shopee', {});
        } catch (error) {
            console.error('Error posting shopee to LinkedIn:', JSON.stringify(error));
        }
    }

    const updateYoutubePostedForShopeeImage = async () => {
        try {
            setLoading(true);
            await post('/shopee/update-youtube-posted-shopee-image', {});

            toast.success('Cập nhật thành công!');
        } catch (error) {
            console.error('Error:', JSON.stringify(error));
            toast.error('Cập nhật thất bại');
        } finally {
            setLoading(false);
        }
    }

    return (<>
        <TitleMain>Quản lý đăng facebook</TitleMain>
        <CardItem>
            <TitleSub>Fanpage Facebook</TitleSub>
            <Button variant="contained" onClick={handlePostVideos} disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đăng video lên fanpage'}
            </Button>

            <ul style={{ marginTop: 20 }}>
                {status.map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                ))}
            </ul>


            <Button variant="contained" onClick={() => fanpagePostShopee()} disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đăng sản phẩm shopee lên page facebook'}
            </Button>
        </CardItem>

        <CardItem>
            <TitleSub>Group facebook</TitleSub>

            <Button variant="contained" onClick={() => fanpagePostGroup()} disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đăng bài lên group facebook'}
            </Button>
        </CardItem>

        <CardItem>
            <TitleSub>Youtube</TitleSub>

            <Button variant="contained" onClick={() => uploadShopeeToYoutube()} disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đăng video và bình luận link shopee lên youtube'}
            </Button>

            <Button variant="contained" onClick={() => updateYoutubePostedForShopeeImage()} disabled={loading} sx={{ marginTop: "20px" }}>
                {loading ? 'Đang xử lý...' : 'Cập nhật dữ liệu youtube posted khi shopee là hình ảnh không thể đăng youtube'}
            </Button>
        </CardItem>


        <CardItem>
            <TitleSub>LinkedIn</TitleSub>

            <Button variant="contained" onClick={() => uploadShopeeToLinkedIn()} disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đăng video/hình ảnh và bình luận link shopee lên tài khoản LinkedIn'}
            </Button>
        </CardItem>


    </>

    );
}
