'use client';

import ControlledSwitch from '@/components/ControlledSwitch';
import FormTextField from '@/components/FormTextField';
import useGetCollaborators from '@/hooks/Collaborator/useGetCollaborators';
import useCreatePost, { CreatePostDto } from '@/hooks/Post/useCreatePost';
import useGetTopics from '@/hooks/Topic/useGetTopics';
import { BackLink, CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { ProfessionOptions, TopicTypeOptions } from '@/utils/const';
import { Collaborator, Topic } from '@/utils/type';
import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type Description = {
    title: string;
    description: string;
    footer: string;
}

export type PostDto = {
    social: string;
    descriptions: Description[];
    active?: boolean;
}

export type Post = {
    id?: string;
    social: string;
    title?: string;
    description: string;
    footer?: string;
    active?: boolean;
    collaborator?: any;

};

export type CreatePostForm = {
    social: string,
    title?: string,
    description: string,
    footer?: string,
    active?: boolean,
    topic_id?: string,
    collaborator_id?: string;
    profession?: string;
    has_file?: boolean;
}


export default function CreateTiktokVideoPage() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [loading, setLoading] = useState(false);
    const { createPost } = useCreatePost();
    const { fetchTopics } = useGetTopics();
    const { getCollaborators } = useGetCollaborators();

    const {
        handleSubmit,
        formState: { errors },
        control,
        watch,
        setValue
    } = useForm<CreatePostForm>({
        defaultValues: {
            social: '',
            title: '',
            description: '',
            footer: '',
            active: true,
            collaborator_id: '',
            topic_id: '',
            has_file: false,
        },
    });

    const social = watch("social");
    const profession = watch("profession");

    useEffect(() => {
        setValue('topic_id', "");
        const getTopics = async () => {
            const resTop = await fetchTopics({ isPagin: false, type: social });
            if (resTop?.success) {
                setTopics(resTop.result.data);
            }
        };

        getTopics();
    }, [social]);

    useEffect(() => {
        setValue('collaborator_id', "");
        const getColla = async () => {
            const resColla = await getCollaborators({ isPagin: false, profession });
            if (resColla) setCollaborators(resColla.result.data);
        };
        getColla();
    }, [profession]);

    const onSubmit: SubmitHandler<CreatePostForm> = async (data) => {
        setLoading(true);
        try {
            const payload: CreatePostDto = {
                social: data.social,
                title: data.title,
                descriptions: data.description.split('\n\n'),
                footer: data.footer,
                active: data.active,
                topic_id: data.topic_id,
                collaborator_id: data?.collaborator_id,
                has_file: data.has_file
            }

            const res = await createPost(payload);

            if (res?.success) {
                toast.success('Tạo bài đăng thành công!');
            } else {
                toast.error(res?.message || 'Tạo bài đăng thất bại!');
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
            <TitleMain>Thêm bài đăng hàng loạt</TitleMain>
            <CardItem>
                <HeaderRow>
                    <BackLink href="/data/post">
                        <span className="mr-1">←</span> Trở về danh sách
                    </BackLink>
                </HeaderRow>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <FormTextField
                        name="social"
                        control={control}
                        label="Đăng lên"
                        required
                        options={[
                            { label: '-- Đăng lên --', value: '' },
                            ...Object.entries(TopicTypeOptions).map(([value, label]) => ({
                                label,
                                value,
                            }))
                        ]}
                    />

                    <FormTextField
                        name="topic_id"
                        control={control}
                        label="Chủ đề"
                        required
                        disabled={!social}
                        options={[
                            { label: '-- Chọn chủ đề --', value: '' },
                            ...(topics || []).map(topic => ({
                                label: topic.name,
                                value: topic?.id || "",
                            }))
                        ]}
                    />

                    <FormTextField
                        name="profession"
                        control={control}
                        label="Lĩnh vực hợp tác"
                        options={[
                            { label: '-- Chọn lĩnh vực --', value: '' },
                            ...Object.entries(ProfessionOptions).map(([value, label]) => ({
                                label: label,
                                value: value,
                            }))
                        ]}
                    />

                    <FormTextField
                        name="collaborator_id"
                        control={control}
                        label="Cộng tác với"
                        required
                        disabled={!profession}
                        options={[
                            { label: '-- Chọn người hợp tác --', value: '' },
                            ...(collaborators || []).map(c => ({
                                label: c.name,
                                value: c?.id || "",
                            }))
                        ]}
                    />
                    <FormTextField
                        multiline
                        rows={4}
                        name="title"
                        control={control}
                        label="Tiêu đề"
                    />

                    <ControlledSwitch
                        name="has_file"
                        control={control}
                        label="Có file đính kèm? (vd: trọ evohome có hình)"
                    />

                    <FormTextField
                        multiline
                        rows={8}
                        name="description"
                        control={control}
                        label="Dữ liệu bài post"
                        required
                        placeholder="Mỗi bài post cách nhau 1 hàng trống"
                    />

                    <FormTextField
                        multiline
                        rows={4}
                        name="footer"
                        control={control}
                        label="Câu cuối (thông tin liên hệ)"
                    />

                    <ControlledSwitch
                        name="active"
                        control={control}
                        label="Kích hoạt"
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 2, width: "200px", float: "inline-end" }}
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                    </Button>
                </Box>
            </CardItem>
        </>
    );
}
