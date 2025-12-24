'use client';

import { User } from '@/common/type';
import BackToList from '@/components/BackToList';
import useCreateUser from '@/hooks/User/useCreateUser';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import React, { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { USER_DEFAULT_VALUES } from '../const';
import UserForm from '../UserForm';


const CreateUser: React.FC = () => {
    const { createUser, loading } = useCreateUser();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<User>({
        defaultValues: USER_DEFAULT_VALUES,
    });

    const onSubmit: SubmitHandler<User> = useCallback(
        async (data) => {
            try {
                const res = await createUser(data);

                if (res?.success) {
                    toast.success('Tạo mới thành công!');
                    reset(USER_DEFAULT_VALUES);
                    return;
                }

                toast.error(res?.message || 'Tạo mới thất bại');
            } catch {
                toast.error('Lỗi hệ thống, vui lòng thử lại');
            }
        },
        [createUser, reset],
    );

    return (
        <>
            <TitleMain>Thêm mới người dùng</TitleMain>

            <CardItem>
                <HeaderRow>
                    <BackToList href="/user" />
                </HeaderRow>

                <UserForm
                    control={control}
                    errors={errors}
                    loading={loading}
                    onSubmit={handleSubmit(onSubmit)}
                />

            </CardItem>
        </>
    );
};

export default CreateUser;
