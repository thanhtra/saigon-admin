'use client';

import useCreateCronJob from '@/hooks/useCreateCronJob';
import { BackLink, CardItem, HeaderRow, IOSSwitch, TitleMain } from '@/styles/common';
import { CronJobTypeEnum, JobTypeDescription } from '@/utils/const';
import { CronJobInput } from '@/utils/type';
import {
    Box,
    Button,
    FormControlLabel,
    MenuItem,
    TextField
} from '@mui/material';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function CreateJob() {
    const { createCronJob } = useCreateCronJob();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CronJobInput>({
        defaultValues: {
            job_type: '',
            description: "",
            is_run_job: true
        },
    });


    const onSubmit: SubmitHandler<CronJobInput> = async (data) => {
        setLoading(true);
        try {
            const res = await createCronJob({
                job_type: data.job_type,
                description: JobTypeDescription[data.job_type as CronJobTypeEnum] || "",
                is_run_job: data.is_run_job
            });
            if (res?.success) {
                reset();
                toast.success('Tạo cron job thành công!');
            } else {
                toast.error(res?.message || 'Tạo thất bại!');
            }
        } catch (err) {
            toast.error('Có lỗi xảy ra khi tạo cron job.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TitleMain>Thêm mới Cron Job</TitleMain>
            <CardItem>
                <HeaderRow>
                    <BackLink href="/cron-job">
                        <span className="mr-1">←</span> Trở về danh sách
                    </BackLink>
                </HeaderRow>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <TextField
                        fullWidth
                        select
                        label="Cron Job"
                        margin="normal"
                        {...register('job_type', { required: 'Chọn Cron Job' })}
                        error={!!errors.job_type}
                        helperText={errors.job_type?.message}
                    >
                        <MenuItem value="">-- Chọn Cron Job --</MenuItem>
                        {Object.entries(JobTypeDescription).map(([key, label]) => (
                            <MenuItem key={key} value={key}>
                                {label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <FormControlLabel
                        control={
                            <IOSSwitch
                                {...register('is_run_job')}
                                defaultChecked={false}
                            />
                        }
                        label="Chạy Job"
                        sx={{
                            margin: "20px 10px 0px 0px",
                            gap: 2,
                            '& .MuiFormControlLabel-label': {
                                marginRight: '10px',
                            },
                        }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 2, width: "200px", display: "block" }}
                            disabled={loading}
                        >
                            {loading ? 'Đang lưu...' : 'Lưu'}
                        </Button>
                    </Box>

                </Box>
            </CardItem>
        </>
    );
}
