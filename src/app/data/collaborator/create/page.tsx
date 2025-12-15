'use client';

import BackToList from "@/components/BackToList";
import useCreateCollaborator from "@/hooks/Collaborator/useCreateCollaborator";
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { Collaborator } from "@/utils/type";
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import CollaboratorForm from "../CollaboratorForm";

const CreateCollaborator: React.FC = () => {
    const { createCollaborator } = useCreateCollaborator();
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<Collaborator>({
        defaultValues: {
            profession: null,
            name: "",
            phone: "",
            description: "",
            link_document: ""
        },
    });

    const onSubmit: SubmitHandler<Collaborator> = async (data) => {
        setLoading(true);
        try {
            const res = await createCollaborator(data);
            if (res?.success) {
                reset();
                toast.success('Tạo cộng tác viên thành công!');
            } else {
                toast.error(res?.message);
            }
        } catch (error) {
            toast.error('Lỗi xảy ra khi tạo cộng tác viên.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TitleMain>Thêm mới cộng tác viên</TitleMain>
            <CardItem>
                <HeaderRow>
                    <BackToList href="/data/collaborator" />
                </HeaderRow>

                <CollaboratorForm
                    control={control}
                    errors={errors}
                    loading={loading}
                    onSubmit={handleSubmit(onSubmit)}
                />
            </CardItem>
        </>
    );
};

export default CreateCollaborator;
