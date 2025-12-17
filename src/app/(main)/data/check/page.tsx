'use client';

import useCheckData from '@/hooks/useCheckData';
import { CardItem, TitleMain } from '@/styles/common';
import { TypeCheckDataOptions } from '@/utils/const';
import {
    Button,
    MenuItem,
    Select
} from '@mui/material';
import { useState } from 'react';

export default function CheckData() {
    const [loading, setLoading] = useState(false);
    const [typeCheck, setTypeCheck] = useState('');
    const { checkData } = useCheckData();
    const [result, setResult] = useState<string[]>([]);


    const handleCheckVideo = async () => {
        setLoading(true);
        setResult(['⏳ Đang kiểm tra...']);

        try {
            const res = await checkData({ type: typeCheck });

            if (res?.success) {
                if (Array.isArray(res.result) && res.result.length > 0) {
                    setResult(prev => [
                        ...prev,
                        ...res.result.map((item: any) => `❌ ${item}`),
                        '🎉 Hoàn tất kiểm tra!',
                    ]);
                } else {
                    setResult(prev => [...prev, '✅ Hoàn tất kiểm tra!']);
                }
            } else {
                setResult(prev => [...prev, `❌ Thất bại: ${res?.message}`]);
            }
        } catch (err: any) {
            setResult(prev => [...prev, `❌ Lỗi hệ thống: ${err.message}`]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TitleMain>Kiểm tra dữ liệu</TitleMain>
            <CardItem>
                <Select
                    size="small"
                    value={typeCheck}
                    displayEmpty
                    onChange={(e) => setTypeCheck(e.target.value)}
                    sx={{ width: 500 }}
                >
                    <MenuItem value="">Tất cả</MenuItem>
                    {Object.entries(TypeCheckDataOptions).map(([key, label]) => (
                        <MenuItem key={key} value={key}>
                            {label}
                        </MenuItem>
                    ))}
                </Select>

                <Button
                    type="button"
                    variant="contained"
                    sx={{ width: "200px", ml: 5, height: "38px", mb: "4px" }}
                    color="primary"
                    disabled={loading || !typeCheck}
                    onClick={() => handleCheckVideo()}
                >
                    {loading ? 'Đang kiểm tra...' : 'Kiểm tra'}
                </Button>

                <ul style={{ marginTop: 20 }}>
                    {(result || []).map((msg, idx) => (
                        <li key={idx}>{msg}</li>
                    ))}
                </ul>
            </CardItem>
        </>
    );
}
