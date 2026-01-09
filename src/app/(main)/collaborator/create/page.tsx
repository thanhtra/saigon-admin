'use client';

import { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { ErrorMessage } from '@/common/const';
import { CollaboratorInput } from '@/common/type';
import BackToList from '@/components/BackToList';
import useCreateCollaborator from '@/hooks/Collaborator/useCreateCollaborator';
import { CardItem, HeaderRowOneItem, TitleMain } from '@/styles/common';
import CollaboratorForm from '../CollaboratorForm';
import { COLLABORATOR_DEFAULT_VALUES } from '../const';



export default function CreateCollaborator() {
    const { createCollaborator, loading } = useCreateCollaborator();

    const { control, handleSubmit, reset } =
        useForm<CollaboratorInput>({
            defaultValues: COLLABORATOR_DEFAULT_VALUES,
        });

    const onSubmit: SubmitHandler<CollaboratorInput> =
        useCallback(
            async (data) => {
                try {
                    const payload: CollaboratorInput = {
                        user_id: data.user_id,
                        field_cooperation: data.field_cooperation,
                        note: data.note,
                        active: data.active
                    }
                    const res = await createCollaborator(payload);

                    if (res?.success) {
                        toast.success('Tạo cộng tác viên thành công');
                        reset(COLLABORATOR_DEFAULT_VALUES);
                        return;
                    }

                    toast.error('Tạo thất bại');
                } catch {
                    toast.error(ErrorMessage.SYSTEM);
                }
            },
            [createCollaborator, reset],
        );

    return (
        <>
            <TitleMain>Thêm mới chủ nhà - môi giới</TitleMain>

            <CardItem>
                <HeaderRowOneItem>
                    <BackToList href="/collaborator" />
                </HeaderRowOneItem>

                <CollaboratorForm
                    control={control}
                    loading={loading}
                    onSubmit={handleSubmit(onSubmit)}
                />
            </CardItem>
        </>
    );
}
