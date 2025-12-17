'use client';

import BackToList from "@/components/BackToList";
import useCreateTopic from "@/hooks/Topic/useCreateTopic";
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { TopicInput } from '@/utils/type';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import TopicForm from "../TopicForm";

const TopicTiktok: React.FC = () => {
    const { createTopic } = useCreateTopic();
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<TopicInput>({
        defaultValues: {
            type: "",
            name: "",
            description: "",
        },
    });

    const onSubmit: SubmitHandler<TopicInput> = async (data) => {
        setLoading(true);
        try {
            const res = await createTopic(data);
            if (res?.success) {
                reset();
                toast.success('Tạo chủ đề thành công!');
            } else {
                toast.error(res?.message);
            }
        } catch (error) {
            toast.error('Lỗi xảy ra khi tạo chủ đề.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TitleMain>Thêm mới chủ đề</TitleMain>
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
};

export default TopicTiktok;
