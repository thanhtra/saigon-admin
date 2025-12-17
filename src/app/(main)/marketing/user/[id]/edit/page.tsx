'use client';

import BackToList from '@/components/BackToList';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { User } from '@/types/user';
import useGetUserDetail from '@/hooks/User/useGetUserDetail';
import useUpdateUser from '@/hooks/User/useUpdateUser';
import { USER_DEFAULT_VALUES } from '../../const';
import UserForm from '../../UserForm';

export default function EditUser() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const { getUserDetail } = useGetUserDetail();
    const { updateUser, loading } = useUpdateUser();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<User>({
        defaultValues: USER_DEFAULT_VALUES,
    });

    // ---------------- FETCH DETAIL ----------------
    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const res = await getUserDetail(id);

                if (res?.success) {
                    reset({
                        ...USER_DEFAULT_VALUES,
                        ...res.result,
                        password: '', // ⚠️ không fill password
                    });
                } else {
                    toast.error('Không tìm thấy người dùng');
                    router.replace('/marketing/user');
                }
            } catch {
                toast.error('Không thể tải dữ liệu');
            }
        })();
    }, [id, getUserDetail, reset, router]);

    // ---------------- SUBMIT ----------------
    const onSubmit = async (data: User) => {
        try {
            const res = await updateUser(id, data);

            if (res?.success) {
                toast.success('Cập nhật thành công!');
                router.push('/marketing/user');
                return;
            }

            toast.error(res?.message || 'Cập nhật thất bại');
        } catch {
            toast.error('Lỗi hệ thống');
        }
    };

    return (
        <>
            <TitleMain>Cập nhật người dùng</TitleMain>

            <CardItem>
                <HeaderRow>
                    <BackToList href="/marketing/user" />
                </HeaderRow>

                <UserForm
                    control={control}
                    errors={errors}
                    loading={loading}
                    onSubmit={handleSubmit(onSubmit)}
                    isEdit
                />
            </CardItem>
        </>
    );
}
