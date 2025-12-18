'use client';

import { useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';

import BackToList from '@/components/BackToList';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import useCreateCollaborator from '@/hooks/Collaborator/useCreateCollaborator';
import CollaboratorForm from '../CollaboratorForm';
import { Collaborator, CollaboratorInput } from '@/common/type';


const DEFAULT_VALUES: CollaboratorInput = {
    user_id: '',
    type: undefined as any,
    field_cooperation: undefined as any,
    active: true,
};

export default function CreateCollaborator() {
    const { createCollaborator, loading } = useCreateCollaborator();

    const { control, handleSubmit, reset } =
        useForm<CollaboratorInput>({
            defaultValues: DEFAULT_VALUES,
        });

    const onSubmit: SubmitHandler<CollaboratorInput> =
        useCallback(
            async (data) => {
                try {
                    const res = await createCollaborator(data);

                    if (res?.success) {
                        toast.success('Tạo cộng tác viên thành công');
                        reset(DEFAULT_VALUES);
                        return;
                    }

                    toast.error(res?.message || 'Tạo thất bại');
                } catch {
                    toast.error('Lỗi hệ thống');
                }
            },
            [createCollaborator, reset],
        );

    return (
        <>
            <TitleMain>Thêm mới chủ nhà / môi giới</TitleMain>

            <CardItem>
                <HeaderRow>
                    <BackToList href="/collaborators" />
                </HeaderRow>

                <CollaboratorForm
                    control={control}
                    loading={loading}
                    onSubmit={handleSubmit(onSubmit)}
                />
            </CardItem>
        </>
    );
}
