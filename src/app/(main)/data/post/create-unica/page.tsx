'use client';

import FormTextField from '@/components/FormTextField';
import useGetCollaborators from '@/hooks/Collaborator/useGetCollaborators';
import useCrawUnica, { CrawUnica } from '@/hooks/Post/useCrawUnica';
import useGetTopics from '@/hooks/Topic/useGetTopics';
import { BackLink, CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { ProfessionOptions, TopicTypeOptions } from '@/utils/const';
import { Collaborator, Topic } from '@/utils/type';
import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export type CrawUnicaForm = {
    social: string,
    url: string,
    title?: string,
    footer?: string,
    topic_id?: string,
    collaborator_id?: string;
    profession?: string;
}


export default function CreateUnica() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [loading, setLoading] = useState(false);
    const { crawUnica } = useCrawUnica();
    const { fetchTopics } = useGetTopics();
    const { getCollaborators } = useGetCollaborators();

    const {
        handleSubmit,
        formState: { errors },
        control,
        watch,
        setValue
    } = useForm<CrawUnicaForm>({
        defaultValues: {
            social: '',
            title: '',
            url: '',
            footer: '',
            collaborator_id: '',
            topic_id: '',
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

    const onSubmit: SubmitHandler<CrawUnicaForm> = async (data) => {
        setLoading(true);
        try {
            const payload: CrawUnica = {
                social: data.social,
                url: data.url,
                title: data.title,
                footer: data.footer,
                topic_id: data.topic_id,
                collaborator_id: data?.collaborator_id,
            }

            const res = await crawUnica(payload);

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
            <TitleMain>Craw bài đăng Unica vào Post</TitleMain>
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

                    <FormTextField
                        name="url"
                        control={control}
                        label="Url Unica"
                        placeholder='Ví dụ: https://unica.vn/course/marketing'
                        required={true}
                    />

                    <FormTextField
                        multiline
                        rows={4}
                        name="footer"
                        control={control}
                        label="Câu cuối (thông tin liên hệ)"
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
