'use client';

import BackToList from '@/components/BackToList';
import { CardItem, HeaderRowOneItem, TitleMain } from '@/styles/common';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import useGetCollaboratorDetail from '@/hooks/Collaborator/useGetCollaboratorDetail';
import useUpdateCollaborator from '@/hooks/Collaborator/useUpdateCollaborator';

import { ErrorMessage } from '@/common/const';
import { Option } from '@/common/type';
import { CollaboratorTypeForm } from '@/types';
import CollaboratorForm from '../../CollaboratorForm';
import { COLLABORATOR_DEFAULT_VALUES } from '../../const';

export default function EditCollaborator() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const { getCollaboratorDetail } = useGetCollaboratorDetail();
    const { updateCollaborator, loading } = useUpdateCollaborator();

    const [userOption, setUserOption] = useState<Option | null>(null);

    const { control, handleSubmit, reset } = useForm<CollaboratorTypeForm>({
        defaultValues: COLLABORATOR_DEFAULT_VALUES,
    });

    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const res = await getCollaboratorDetail(id);

                console.log('fasdfds', res);

                if (res?.success) {
                    const colla = res.result;
                    const user = colla.user;

                    setUserOption({
                        label: `${user.name} - ${user.phone}`,
                        value: user.id,
                    });

                    reset({
                        user_id: user.id,
                        type: colla.type,
                        field_cooperation: colla.field_cooperation,
                        note: colla.note,
                        active: colla.active,
                        is_confirmed_ctv: colla.is_confirmed_ctv
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

    const onSubmit = async (data: CollaboratorTypeForm) => {
        try {
            const res = await updateCollaborator(id, {
                type: data.type,
                field_cooperation: data.field_cooperation,
                note: data.note,
                active: data.active,
                is_confirmed_ctv: data.is_confirmed_ctv
            });

            if (res?.success) {
                toast.success('Cập nhật thành công');
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
