'use client';

import { ErrorMessage } from '@/common/const';
import { User } from '@/common/type';
import BackToList from '@/components/BackToList';
import useGetUserDetail from '@/hooks/User/useGetUserDetail';
import useUpdateUser from '@/hooks/User/useUpdateUser';
import { CardItem, HeaderRowOneItem, TitleMain } from '@/styles/common';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
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


    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const res = await getUserDetail(id);

                if (res?.success) {
                    reset({
                        ...USER_DEFAULT_VALUES,
                        ...res.result,
                        password: '',
                    });
                } else {
                    toast.error('Không tìm thấy người dùng');
                    router.replace('/user');
                }
            } catch {
                toast.error(ErrorMessage.SYSTEM);
            }
        })();
    }, [id, getUserDetail, reset, router]);


    const onSubmit = async (data: User) => {
        try {
            const res = await updateUser(id, data);

            if (res?.success) {
                toast.success('Cập nhật thành công!');
                router.push('/user');
                return;
            }

            toast.error('Cập nhật thất bại');
        } catch {
            toast.error(ErrorMessage.SYSTEM);
        }
    };

    return (
        <>
            <TitleMain>Cập nhật người dùng</TitleMain>

            <CardItem>
                <HeaderRowOneItem>
                    <BackToList href="/user" />
                </HeaderRowOneItem>

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
