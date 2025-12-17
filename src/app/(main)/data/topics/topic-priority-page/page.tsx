'use client';

import BackToList from '@/components/BackToList';
import useUpdatePriorityTopics from '@/hooks/Topic/useUpdatePriorityTopics';
import useGetTopics from '@/hooks/Topic/useGetTopics';
import { CardItem, TitleMain } from '@/styles/common';
import { Topic } from '@/utils/type';
import { Box, Button, Checkbox, FormControlLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const TopicPriorityPage: React.FC = () => {
    const { fetchTopics } = useGetTopics();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);

    const { updatePriorityTopics } = useUpdatePriorityTopics();

    const getTopics = async () => {
        setLoading(true);
        try {
            const res = await fetchTopics({ isPagin: false });

            if (res?.success) {
                const list = res.result.data;
                setTopics(list);

                setSelectedTopics(list.filter((t: Topic) => t.is_priority).map((t: Topic) => t.id as string));
            } else {
                setTopics([]);
            }
        } catch (error) {
            console.error(error);
            setTopics([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTopics();
    }, []);


    const handleToggle = (id: string) => {
        setSelectedTopics(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            console.log('dsfasdf', selectedTopics)
            const res = await updatePriorityTopics(selectedTopics);
            if (res.success) {
                toast.success('Cập nhật danh sách ưu tiên thành công!');
                getTopics();
            } else {
                toast.error('Có lỗi xảy ra khi cập nhật.');
            }
        } catch (err) {
            console.error(err);
            toast.error('Có lỗi xảy ra khi cập nhật.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <TitleMain>Chọn danh sách Topic ưu tiên</TitleMain>

            <Button
                variant="contained"
                sx={{ mb: 3, float: "right" }}
                onClick={handleSave}
                disabled={saving}
            >
                {saving ? 'Đang lưu...' : 'Lưu danh sách ưu tiên'}
            </Button>

            <BackToList href="/data/topics" />

            <CardItem >
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 1,
                        padding: "20px"
                    }}
                >
                    {topics?.map(topic => (
                        <FormControlLabel
                            key={topic.id}
                            control={
                                <Checkbox
                                    checked={selectedTopics.includes(topic.id as string)}
                                    onChange={() => handleToggle(topic.id as string)}
                                />
                            }
                            label={`${topic.name} (${topic.type})`}
                        />
                    ))}
                </Box>
            </CardItem>
        </>
    );
};

export default TopicPriorityPage;
