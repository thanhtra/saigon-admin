'use client';

import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { ErrorMessage } from '@/common/const';
import { Option } from '@/common/type';
import BackToList from '@/components/BackToList';
import useCreateCollaborator from '@/hooks/Collaborator/useCreateCollaborator';
import useGetAvailableCollaborators from '@/hooks/User/useGetAvailableCollaborators';
import { CardItem, HeaderRowOneItem, TitleMain } from '@/styles/common';
import { CollaboratorTypeForm } from '@/types';
import CollaboratorForm from '../CollaboratorForm';
import { COLLABORATOR_DEFAULT_VALUES } from '../const';

export default function CreateCollaborator() {
    const { createCollaborator, loading } = useCreateCollaborator();
    const { getAvailableCollaborators } = useGetAvailableCollaborators();

    const [userOptions, setUserOptions] = useState<Option[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(true);

    const { control, handleSubmit, reset } = useForm<CollaboratorTypeForm>({
        defaultValues: COLLABORATOR_DEFAULT_VALUES,
    });

    useEffect(() => {
        (async () => {
            try {
                const res = await getAvailableCollaborators({ limit: 200 });

                if (res?.success) {
                    const options: Option[] = res.result.map((u: any) => ({
                        label: `${u.name} - ${u.phone}`,
                        value: u.id,
                    }));
                    setUserOptions(options);
                }
            } catch {
                toast.error(ErrorMessage.SYSTEM);
            } finally {
                setLoadingOptions(false);
            }
        })();
    }, [getAvailableCollaborators]);

    const onSubmit: SubmitHandler<CollaboratorTypeForm> = useCallback(
        async (data) => {
            try {
                const payload: CollaboratorTypeForm = {
                    user_id: data.user_id,
                    type: data.type,
                    field_cooperation: data.field_cooperation,
                    note: data.note,
                    active: data.active,
                };

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
        [createCollaborator, reset]
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
                    loading={loading || loadingOptions}
                    onSubmit={handleSubmit(onSubmit)}
                    userOptions={userOptions}
                />
            </CardItem>
        </>
    );
}
