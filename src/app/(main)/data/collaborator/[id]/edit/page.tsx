'use client';

import BackToList from '@/components/BackToList';
import { CardItem, HeaderRow, TitleMain } from '@/styles/common';
import { Collaborator } from '@/utils/type';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import CollaboratorForm from '../../CollaboratorForm';
import useGetCollaboratorDetail from '@/hooks/Collaborator/useGetCollaboratorDetail';
import useUpdateCollaborator from '@/hooks/Collaborator/useUpdateCollaborator';

export default function EditCollaborator() {
    const { id } = useParams();
    const router = useRouter();
    const { getCollaboratorDetail } = useGetCollaboratorDetail();
    const { updateCollaborator } = useUpdateCollaborator();
    const [loading, setLoading] = useState(false);

    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<Collaborator>({
        defaultValues: {
            profession: null,
            name: '',
            phone: '',
            description: '',
            link_document: ''
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getCollaboratorDetail(String(id));
                if (res?.success) {
                    const data = res.result;
                    reset({
                        profession: data.profession,
                        name: data.name,
                        description: data.description,
                        phone: data.phone,
                        link_document: data.link_document
                    });
                }
            } catch (error) {
                toast.error('Không thể tải cộng tác viên');
            }
        };
        fetchData();
    }, [id, getCollaboratorDetail]);

    const onSubmit = async (data: Collaborator) => {
        setLoading(true);
        try {
            await updateCollaborator(String(id), data);
            router.push('/data/collaborator');
            toast.success('Cập nhật thành công!');
        } catch {
            toast.error('Cập nhật thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TitleMain>Cập nhật cộng tác viên</TitleMain>
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
}
