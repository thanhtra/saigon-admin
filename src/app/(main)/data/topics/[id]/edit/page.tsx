'use client';

import BackToList from '@/components/BackToList';
import useGetTopicDetail from '@/hooks/Topic/useGetTopicDetail';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { TopicInput } from '@/utils/type';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import TopicForm from '../../TopicForm';
import useUpdateTopic from '@/hooks/Topic/useUpdateTopic';

export default function EditTopicPage() {
    const { id } = useParams();
    const router = useRouter();
    const { fetchTopicDetail } = useGetTopicDetail();
    const { updateTopic } = useUpdateTopic();
    const [loading, setLoading] = useState(false);

    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<TopicInput>({
        defaultValues: {
            type: '',
            name: '',
            description: ''
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchTopicDetail(String(id));
                if (res?.success) {
                    const data = res.result;
                    reset({
                        name: data.name,
                        description: data.description,
                        type: data.type,
                    });
                }
            } catch (error) {
                toast.error('Không thể tải chủ đề');
            }
        };
        fetchData();
    }, [id, fetchTopicDetail]);

    const onSubmit = async (data: TopicInput) => {
        setLoading(true);
        try {
            await updateTopic(String(id), data);
            router.push('/data/topics');
            toast.success('Cập nhật thành công!');
        } catch {
            toast.error('Cập nhật thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TitleMain>Cập nhật chủ đề</TitleMain>
            <CardItem>
                <HeaderRow>
                    <BackToList href="/data/topics" />
                </HeaderRow>

                <TopicForm
                    control={control}
                    errors={errors}
                    loading={loading}
                    onSubmit={handleSubmit(onSubmit)}
                />
            </CardItem>
        </>
    );
}
