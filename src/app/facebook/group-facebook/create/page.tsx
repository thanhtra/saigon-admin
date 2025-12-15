'use client';

import BackToList from '@/components/BackToList';
import ScripGetGroupFacebook from '@/components/ScripGetGroupFacebook';
import useCreateGroupFacebook from '@/hooks/GroupFacebook/useCreateGroupFacebook';
import useGetTopics from '@/hooks/Topic/useGetTopics';
import { CardItem, HeaderRow, TitleMain, TitleSub } from '@/styles/common';
import { TopicType } from '@/utils/const';
import { GroupFacebookInfo, GroupFacebookPayload } from '@/utils/type';
import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import GroupFacebookForm from '../GroupFacebookForm';

export type GroupFacebookInput = {
    topic_id: string;
    group_ids: string;
}

export default function CreateTiktokVideoPage() {
    const [loading, setLoading] = useState(false);
    const [topics, setTopics] = useState<any[]>([]);
    const { fetchTopics } = useGetTopics();
    const { createGroupFacebook } = useCreateGroupFacebook();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<GroupFacebookInput>({
        defaultValues: {
            topic_id: "",
            group_ids: "",
        },
    });

    useEffect(() => {
        fetchTopics({ isPagin: false, type: TopicType.Facebook }).then((res) => {
            if (res?.success) setTopics(res.result.data);
        });
    }, []);

    const onSubmit = async (data: GroupFacebookInput) => {
        const blocks = data.group_ids.split('\n\n');
        const groups: GroupFacebookInfo[] = blocks.map(block => {
            const [groupId, ...descParts] = block.trim().split('\n');
            let groupName = descParts.join(' ').trim();

            return {
                group_id: groupId.trim(),
                group_name: groupName,
            };
        });
        if (groups.length === 0) return;

        setLoading(true);
        try {
            const payload: GroupFacebookPayload = {
                topic_id: data.topic_id,
                groups: groups
            }
            const res = await createGroupFacebook(payload);
            if (res?.success) {
                toast.success('Tạo thành công!');
                reset({});
            } else {
                toast.error(res?.message || 'Tạo thất bại!');
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
            <TitleMain>Thêm mới nhóm facebook</TitleMain>
            <CardItem>
                <HeaderRow>
                    <BackToList href="/facebook/group-facebook" />
                </HeaderRow>

                <GroupFacebookForm
                    control={control}
                    errors={errors}
                    loading={loading}
                    onSubmit={handleSubmit(onSubmit)}
                    topics={topics}
                />
            </CardItem>

            <CardItem>
                <TitleSub>Script lấy danh sách id và tên nhóm</TitleSub>

                <Typography mb={2}>Vào facebook tìm nhóm sau đó dán vào console để lấy danh sách ID và tên nhóm, dán vào ô thông tin nhóm để tạo</Typography>
                <Typography mb={2}>
                    Dán nhiều video theo định dạng:<br />
                    <code>
                        1923383441023894<br />
                        Tên nhóm (Bất động sản)
                    </code>
                    <br />Mỗi block cách nhau bằng một dòng trống.
                </Typography>

                <ScripGetGroupFacebook />
            </CardItem>

        </>
    );
}
