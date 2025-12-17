'use client';

import ScripGetListVideoTiktokSearch from '@/components/ScripGetListVideoTiktokSearch';
import ScripGetListVideoTiktokSearchProfile from '@/components/ScripGetListVideoTiktokSearchProfile';
import useCreateTiktokVideo from '@/hooks/TiktokVideo/useCreateTiktokVideo';
import useGetTopics from '@/hooks/Topic/useGetTopics';
import { BackLink, CardItem, HeaderRow, TitleMain, TitleSub } from '@/styles/common';
import { TopicType } from '@/utils/const';
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, MenuItem, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function CreateTiktokVideoPage() {
    const [rawText, setRawText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [topics, setTopics] = useState<any[]>([]);
    const [selectedTopicId, setSelectedTopicId] = useState('');
    const [isPriority, setIsPriority] = useState(false);
    const { fetchTopics } = useGetTopics();
    const { createTiktokVideo } = useCreateTiktokVideo();

    useEffect(() => {
        fetchTopics({ size: 100, type: TopicType.Affiliate }).then((res) => {
            if (res?.success) setTopics(res.result.data);
        });
    }, []);

    const handleSubmit = async () => {
        const blocks = rawText.split('\n\n');
        const videos = blocks.map(block => {
            const [link, ...descParts] = block.trim().split('\n');
            let videoTitle = descParts.join(' ').trim();

            // Xoá đoạn bắt đầu bằng "Reply to @" hoặc "Trả lời @" ở đầu câu
            videoTitle = videoTitle.replace(/^(Reply to @[^\s]+|Trả lời @[^\s]+)\s*/i, '');
            videoTitle = videoTitle.replace(/(\(?\+?84\)?[\s\-\.]*)?0?\d{2}[\s\-\.]?\d{3}[\s\-\.]?\d{3,4}/g, '');
            videoTitle = videoTitle.replace(/\b(tik[\s\-]?tok)\b/gi, '');

            return {
                video_link: link.trim(),
                video_title: videoTitle,
            };
        });

        setLoading(true);
        try {
            const res = await createTiktokVideo(videos, selectedTopicId, isPriority);
            setResult(JSON.stringify(res, null, 2));
            if (res?.success) {
                toast.success('Tạo video thành công!');
                setRawText('');
            } else {
                toast.error(res?.message || 'Tạo video thất bại!');
            }
        } catch (error) {
            console.error(error);
            toast.error('Có lỗi xảy ra khi gửi dữ liệu!');
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <TitleMain>Thêm mới Video TikTok</TitleMain>
            <CardItem>
                <HeaderRow>
                    <BackLink href="/tiktok/video-tiktok">
                        <span className="mr-1">←</span> Trở về danh sách
                    </BackLink>
                </HeaderRow>

                <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <TextField
                        fullWidth
                        select
                        label="Chủ đề video"
                        margin="normal"
                        value={selectedTopicId}
                        onChange={(e) => setSelectedTopicId(e.target.value)}
                        required
                    >
                        <MenuItem value="">-- Chọn chủ đề --</MenuItem>
                        {topics.map((topic) => (
                            <MenuItem key={topic.id} value={topic.id}>
                                {topic.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth
                        multiline
                        rows={12}
                        label="Dữ liệu video TikTok"
                        value={rawText}
                        onChange={(e) => setRawText(e.target.value)}
                        placeholder={`https://www.tiktok.com/@user/video/1234567890\nMô tả video`}
                        margin="normal"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isPriority}
                                onChange={(e) => setIsPriority(e.target.checked)}
                            />
                        }
                        label="Đặt ưu tiên đăng trước"
                        sx={{ display: "block" }}
                    />

                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        {loading ? <CircularProgress size={20} /> : 'Lưu vào Database'}
                    </Button>


                </Box>
            </CardItem>

            <CardItem>
                <TitleSub>Script lấy danh sách link và mô tả video tiktok</TitleSub>

                <Typography mb={2}>Vào tiktok tìm chủ đề sau đó lướt xuống và dán vào console để lấy danh sách link và mô tả, sau khi chạy nó tự copy cho mình, chỉ cần dán vào ô Dữ liệu video tiktok để tạo</Typography>
                <Typography mb={2}>
                    Dán nhiều video theo định dạng:<br />
                    <code>
                        https://www.tiktok.com/@username/video/1234567890<br />
                        Tiêu đề video
                    </code>
                    <br />Mỗi block cách nhau bằng một dòng trống.
                </Typography>

                <TitleSub>Lấy ở link đã search chủ đề và mở tab video</TitleSub>
                <ScripGetListVideoTiktokSearch />

                <TitleSub>Lấy ở link profile user</TitleSub>
                <ScripGetListVideoTiktokSearchProfile />
            </CardItem>

        </>
    );
}
