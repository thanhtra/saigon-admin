'use client';

import BackToList from '@/components/BackToList';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { CollaboratorInput } from '@/common/type';
import useGetCollaboratorDetail from '@/hooks/Collaborator/useGetCollaboratorDetail';
import useUpdateCollaborator from '@/hooks/Collaborator/useUpdateCollaborator';

import { COLLABORATOR_DEFAULT_VALUES } from '../../const';
import CollaboratorForm from '../../CollaboratorForm';

type UserOption = {
    label: string;
    value: string;
};

export default function EditCollaborator() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const { getCollaboratorDetail } = useGetCollaboratorDetail();
    const { updateCollaborator, loading } = useUpdateCollaborator();

    const [userOption, setUserOption] = useState<UserOption | null>(null);

    const { control, handleSubmit, reset } = useForm<CollaboratorInput>({
        defaultValues: COLLABORATOR_DEFAULT_VALUES,
    });

    // ---------------- FETCH DETAIL ----------------
    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const res = await getCollaboratorDetail(id);

                if (res?.success) {
                    const user = res.result.user;

                    setUserOption({
                        label: `${user.name} - ${user.phone}`,
                        value: user.id,
                    });

                    reset({
                        user_id: user.id,
                        field_cooperation: res.result.field_cooperation,
                        note: res.result.note,
                        active: res.result.active,
                    });
                } else {
                    toast.error('Không tìm thấy cộng tác viên');
                    router.replace('/collaborator');
                }
            } catch {
                toast.error('Không thể tải dữ liệu');
            }
        })();
    }, [id, getCollaboratorDetail, reset, router]);

    // ---------------- SUBMIT ----------------
    const onSubmit = async (data: CollaboratorInput) => {
        try {
            const res = await updateCollaborator(id, data);

            if (res?.success) {
                toast.success('Cập nhật thành công!');
                router.push('/collaborator');
                return;
            }

            toast.error(res?.message || 'Cập nhật thất bại');
        } catch {
            toast.error('Lỗi hệ thống');
        }
    };

    return (
        <>
            <TitleMain>Cập nhật chủ nhà - môi giới</TitleMain>

            <CardItem>
                <HeaderRow>
                    <BackToList href="/collaborator" />
                </HeaderRow>

                <CollaboratorForm
                    control={control}
                    loading={loading}
                    onSubmit={handleSubmit(onSubmit)}
                    isEdit
                    userOption={userOption}
                />
            </CardItem>
        </>
    );
}
