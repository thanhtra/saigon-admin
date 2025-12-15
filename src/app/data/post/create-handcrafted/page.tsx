'use client';

import ControlledSwitch from '@/components/ControlledSwitch';
import FormTextField from '@/components/FormTextField';
import useGetCollaborators from '@/hooks/Collaborator/useGetCollaborators';
import useCreatePost, { CreatePostDto } from '@/hooks/Post/useCreatePost';
import useGetTopics from '@/hooks/Topic/useGetTopics';
import { BackLink, CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { ProfessionOptions, TopicType, TopicTypeOptions } from '@/utils/const';
import { Collaborator, Topic } from '@/utils/type';
import { Delete } from '@mui/icons-material';
import { Box, Button, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type PostForm = {
    social: string;
    topic_id: string;
    title?: string;
    descriptions: { value: string }[];
    footer?: string;
    active?: boolean;
    collaborator_id?: string;
    profession?: string;
};

export default function CreateFacebookGroupPostPage() {
    const { createPost } = useCreatePost();
    const { fetchTopics } = useGetTopics();
    const { getCollaborators } = useGetCollaborators();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [loading, setLoading] = useState(false);

    const {
        handleSubmit,
        control,
        watch,
        setValue
    } = useForm<PostForm>({
        defaultValues: {
            social: '',
            topic_id: '',
            title: '',
            descriptions: [{ value: '' }],
            footer: '',
            active: true,
            collaborator_id: '',
            profession: ''
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


    const { fields, append, remove } = useFieldArray({
        control,
        name: "descriptions",
    });

    const onSubmit: SubmitHandler<PostForm> = async (data) => {

        if (data.social === TopicType.Threads) {
            for (let i = 0; i < data.descriptions.length; i++) {
                const desc = data.descriptions[i].value || '';
                const totalLength =
                    (data.title?.length || 0) +
                    (data.footer?.length || 0) +
                    desc.length;

                if (totalLength > 430) {
                    toast.error(
                        `Nội dung bài post #${i + 1} vượt quá 430 ký tự (hiện tại: ${totalLength}).`
                    );
                    return;
                }
            }
        }

        setLoading(true);


        try {
            const payload: CreatePostDto = {
                social: data.social,
                topic_id: data.topic_id,
                collaborator_id: data?.collaborator_id,
                title: data.title,
                descriptions: data.descriptions
                    .map(d => d.value.trim())
                    .filter(Boolean),
                footer: data.footer,
                active: data.active,
            };

            const res = await createPost(payload);

            if (res?.success) {
                toast.success('Tạo bài đăng thành công!');
            } else {
                toast.error(res?.message || 'Tạo bài đăng thất bại!');
            }
        } catch (err) {
            console.error(err);
            toast.error('Có lỗi xảy ra khi gửi dữ liệu!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TitleMain>Tạo bài đăng thủ công</TitleMain>
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
                        rows={3}
                        name="title"
                        control={control}
                        label="Tiêu đề (dùng chung)"
                    />

                    {fields.map((field, index) => (
                        <Box
                            key={field.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1,
                                mb: 2,
                            }}
                        >
                            <FormTextField
                                multiline
                                rows={5}
                                name={`descriptions.${index}.value`}
                                control={control}
                                label={`Nội dung bài post #${index + 1}`}
                                required
                            />
                            {fields.length > 1 && (
                                <IconButton
                                    onClick={() => remove(index)}
                                    color="error"
                                    sx={{ mt: 1 }}
                                >
                                    <Delete />
                                </IconButton>
                            )}
                        </Box>
                    ))}

                    <Button
                        type="button"
                        variant="outlined"
                        sx={{ mb: 2 }}
                        onClick={() => append({ value: '' })}
                    >
                        + Thêm bài post
                    </Button>

                    <FormTextField
                        multiline
                        rows={3}
                        name="footer"
                        control={control}
                        label="Câu cuối (thông tin liên hệ - dùng chung)"
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
                        {loading ? 'Đang tạo...' : 'Tạo mới'}
                    </Button>
                </Box>
            </CardItem>
        </>
    );
}
