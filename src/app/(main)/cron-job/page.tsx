'use client';

import useGetCronJobs from '@/hooks/Job/useGetJobs';
import useUpdateCronJob from '@/hooks/useUpdateCronJob';
import { CardItem, HeaderRow, IOSSwitch, TitleMain } from '@/styles/common';
import { CronJobUpdate } from '@/utils/type';
import {
    Button, CircularProgress,
    Paper,
    Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function JobPage() {
    const router = useRouter();
    const { getCronJobs } = useGetCronJobs();
    const { updateCronJob } = useUpdateCronJob();
    const [cronJobs, setCronJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getCronJobs();
            if (res?.success) {
                setCronJobs(res.result);
            } else {
                setCronJobs([]);
            }
        } catch (err) {
            setCronJobs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateCronJob = async (e: any, job: any) => {
        setLoading(true);
        try {
            const res = await updateCronJob(job.id, { is_run_job: Boolean(e.target.checked) } as CronJobUpdate);
            if (res.success) {
                toast.success('Cập nhật thành công');
                await fetchData();
            }
        } catch (err) {
            toast.error('Cập nhật không thành công');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <TitleMain>Danh sách Cron Job</TitleMain>
            <CardItem>
                <HeaderRow>
                    <Button variant="contained" onClick={() => router.push('/cron-job/create')}>+ Thêm mới</Button>
                </HeaderRow>

                <Paper sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Cron Job</strong></TableCell>
                                <TableCell><strong>Mô tả</strong></TableCell>
                                <TableCell><strong>Chạy</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                        <CircularProgress size={24} />
                                    </TableCell>
                                </TableRow>
                            ) : cronJobs?.length > 0 ? (
                                cronJobs.map((job) => (
                                    <TableRow key={job.id}>
                                        <TableCell>{job.job_type}</TableCell>
                                        <TableCell>{job.description}</TableCell>
                                        <TableCell>
                                            <IOSSwitch
                                                checked={job.is_run_job}
                                                onChange={(e) => handleUpdateCronJob(e, job)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">Không tìm thấy dữ liệu</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Paper>

            </CardItem>
        </>
    );
}
