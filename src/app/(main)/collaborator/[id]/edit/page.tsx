'use client';

import BackToList from '@/components/BackToList';
import { CardItem, HeaderRowOneItem, TitleMain } from '@/styles/common';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { CollaboratorInput } from '@/common/type';
import useGetCollaboratorDetail from '@/hooks/Collaborator/useGetCollaboratorDetail';
import useUpdateCollaborator from '@/hooks/Collaborator/useUpdateCollaborator';

import { ErrorMessage } from '@/common/const';
import CollaboratorForm from '../../CollaboratorForm';
import { COLLABORATOR_DEFAULT_VALUES } from '../../const';

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
                toast.error(ErrorMessage.SYSTEM);
            }
        })();
    }, [id, getCollaboratorDetail, reset, router]);

    const onSubmit = async (data: CollaboratorInput) => {
        try {
            const res = await updateCollaborator(id, data);

            if (res?.success) {
                toast.success('Cập nhật thành công!');
                router.push('/collaborator');
                return;
            }

            toast.error('Cập nhật thất bại');
        } catch {
            toast.error(ErrorMessage.SYSTEM);
        }
    };

    return (
        <>
            <TitleMain>Cập nhật chủ nhà - môi giới</TitleMain>

            <CardItem>
                <HeaderRowOneItem>
                    <BackToList href="/collaborator" />
                </HeaderRowOneItem>

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
