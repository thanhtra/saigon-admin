'use client';

import BackToList from '@/components/BackToList';
import { CardItem, HeaderRowOneItem, TitleMain } from '@/styles/common';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@/common/const';
import { Option, TenantInput } from '@/common/type';
import useGetTenantDetail from '@/hooks/Tenant/useGetTenantDetail';
import useUpdateTenant from '@/hooks/Tenant/useUpdateTenant';
import { TENANT_DEFAULT_VALUES } from '../../const';
import TenantForm from '../../TenantForm';

export default function EditTenant() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const { getTenantDetail } = useGetTenantDetail();
    const { updateTenant, loading } = useUpdateTenant();

    const [userOption, setUserOption] = useState<Option | null>(null);

    const { control, handleSubmit, reset } = useForm<TenantInput>({
        defaultValues: TENANT_DEFAULT_VALUES,
    });

    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const res = await getTenantDetail(id);

                if (res?.success) {
                    const user = res.result.user;

                    setUserOption({
                        label: `${user.name} - ${user.phone}`,
                        value: user.id,
                    });

                    reset({
                        user_id: user.id,
                        note: res.result.note,
                        active: res.result.active,
                    });
                } else {
                    toast.error('Không tìm thấy tenant');
                    router.replace('/tenant');
                }
            } catch {
                toast.error(ErrorMessage.SYSTEM);
            }
        })();
    }, [id, getTenantDetail, reset, router]);

    const onSubmit = async (data: TenantInput) => {
        try {
            const res = await updateTenant(id, data);
            if (res?.success) {
                toast.success('Cập nhật thành công');
                router.push('/tenant');
                return;
            }
            toast.error('Cập nhật thất bại');
        } catch {
            toast.error(ErrorMessage.SYSTEM);
        }
    };

    return (
        <>
            <TitleMain>Cập nhật tenant</TitleMain>

            <CardItem>
                <HeaderRowOneItem>
                    <BackToList href="/tenant" />
                </HeaderRowOneItem>

                <TenantForm
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
