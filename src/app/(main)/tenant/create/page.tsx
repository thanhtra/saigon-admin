'use client';

import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { ErrorMessage } from '@/common/const';
import { TenantInput } from '@/common/type';
import BackToList from '@/components/BackToList';
import { CardItem, HeaderRowOneItem, TitleMain } from '@/styles/common';
import useCreateTenant from '@/hooks/Tenant/useCreateTenant';

import TenantForm from '../TenantForm';
import { TENANT_DEFAULT_VALUES } from '../const';
import useGetAvailableTenants from '@/hooks/User/useGetAvailableTenants';
import { Option } from '@/common/type';

export default function CreateTenant() {
    const { createTenant, loading } = useCreateTenant();
    const { getAvailableTenants } = useGetAvailableTenants();

    const [userOptions, setUserOptions] = useState<Option[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(true);

    const { control, handleSubmit, reset } = useForm<TenantInput>({
        defaultValues: TENANT_DEFAULT_VALUES,
    });

    useEffect(() => {
        (async () => {
            try {
                const res = await getAvailableTenants({ limit: 200 });
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
    }, [getAvailableTenants]);

    const onSubmit: SubmitHandler<TenantInput> = useCallback(
        async (data) => {
            try {
                const res = await createTenant(data);
                if (res?.success) {
                    toast.success('Tạo tenant thành công');
                    reset(TENANT_DEFAULT_VALUES);
                    return;
                }
                toast.error('Tạo tenant thất bại');
            } catch {
                toast.error(ErrorMessage.SYSTEM);
            }
        },
        [createTenant, reset]
    );

    return (
        <>
            <TitleMain>Thêm mới khách hàng</TitleMain>

            <CardItem>
                <HeaderRowOneItem>
                    <BackToList href="/tenant" />
                </HeaderRowOneItem>

                <TenantForm
                    control={control}
                    loading={loading || loadingOptions}
                    onSubmit={handleSubmit(onSubmit)}
                    userOptions={userOptions}
                />
            </CardItem>
        </>
    );
}
