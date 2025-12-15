'use client';

import FormTextField from '@/components/FormTextField';
import useGetCollaborators from '@/hooks/Collaborator/useGetCollaborators';
import useGetNextPost from '@/hooks/Post/useGetNextPost';
import useGetTopics from '@/hooks/Topic/useGetTopics';
import { BackLink, CardItem, HeaderRow, TitleMain, TitleSub } from '@/styles/common';
import { ProfessionOptions, TopicTypeOptions } from '@/utils/const';
import { Collaborator, Topic } from '@/utils/type';
import { Box, Button, Grid } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
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

export type GetNextPostForm = {
    social: string,
    topic_id?: string,
    collaborator_id?: string;
    profession?: string;
}


export default function GetNextPost() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [loading, setLoading] = useState(false);
    const { fetchTopics } = useGetTopics();
    const { getCollaborators } = useGetCollaborators();
    const { getNextPost } = useGetNextPost();
    const [posts, setPosts] = useState<Post[]>([]);
    const textRef = useRef<HTMLDivElement>(null);

    const {
        handleSubmit,
        formState: { errors },
        control,
        watch,
        setValue
    } = useForm<GetNextPostForm>({
        defaultValues: {
            social: '',
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

    const onSubmit: SubmitHandler<GetNextPostForm> = async (data) => {
        setLoading(true);
        try {
            const payload: GetNextPostForm = {
                social: data.social,
                topic_id: data.topic_id,
                collaborator_id: data?.collaborator_id,
            }

            const res = await getNextPost(payload);

            if (res?.success) {
                setPosts(res.result);

                toast.success('Lấy bài đăng thành công!');
            } else {
                setPosts([]);
                toast.error(res?.message || 'Lấy bài đăng thất bại!');
            }
        } catch (error) {
            setPosts([]);
            console.error(error);
            toast.error('Có lỗi xảy ra khi gửi dữ liệu!');
        } finally {
            setLoading(false);
        }
    };


    const handleCopy = async () => {
        if (!posts || posts.length === 0) {
            toast.error('Không có nội dung để copy');
            return;
        }

        try {
            const text = posts
                .map((p, i) => {
                    const title = typeof p.title === "string" ? p.title.trim() : "";
                    const desc = typeof p.description === "string" ? p.description.trim() : "";
                    const footer = typeof p.footer === "string" ? p.footer.trim() : "";

                    const content = [title, desc, footer].filter(Boolean).join("\n");

                    return `Post #${i + 1}\n\n${content}`;
                })
                .join("\n\n----------------------------------\n\n");

            await navigator.clipboard.writeText(text);

            toast.success('Đã sao chép tất cả bài đăng!');
        } catch (error) {
            console.error("Copy error:", error);
            toast.error('Không thể sao chép, vui lòng thử lại.');
        }
    };


    return (
        <>
            <TitleMain>Lấy bài đăng</TitleMain>
            <CardItem>
                <HeaderRow>
                    <BackLink href="/data/post">
                        <span className="mr-1">←</span> Trở về danh sách
                    </BackLink>
                </HeaderRow>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={2} sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                        <Grid item sx={{ width: "49%" }}>
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
                        </Grid>

                        <Grid item sx={{ width: "49%" }}>
                            <FormTextField
                                name="profession"
                                control={control}
                                label="Lọc cộng tác"
                                options={[
                                    { label: '-- Chọn lĩnh vực để chọn cộng tác --', value: '' },
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
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 2, width: "200px", float: "inline-end" }}
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? 'Đang lấy bài đăng...' : 'Lấy bài đăng'}
                    </Button>
                </Box>
            </CardItem>
            {posts && posts.length > 0 && (
                <CardItem sx={{ mt: 3 }}>

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                        <TitleSub sx={{ marginBottom: "0px" }}>
                            Danh sách bài đăng đã lấy ({posts.length})
                        </TitleSub>

                        <Button
                            onClick={handleCopy}
                            variant="outlined"
                        >
                            Copy nội dung
                        </Button>
                    </Box>

                    {/* LOOP HIỂN THỊ TẤT CẢ POST */}
                    {posts.map((post, index) => (
                        <Box
                            key={post.id ?? index}
                            sx={{
                                border: "1px dashed #ccc",
                                borderRadius: "8px",
                                p: 2,
                                minHeight: "150px",
                                background: "#f9fafb",
                                whiteSpace: "pre-wrap",
                                overflow: "auto",
                                marginBottom: "20px"
                            }}
                        >
                            <b>Post #{index + 1}</b>{'\n\n'}

                            {[
                                post.title?.trim(),
                                post.description?.trim(),
                                post.footer?.trim()
                            ]
                                .filter(Boolean)
                                .join('\n')}
                        </Box>
                    ))}

                </CardItem>
            )}

        </>
    );
}
