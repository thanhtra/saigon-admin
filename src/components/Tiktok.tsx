'use client';

import { CardItem } from '@/styles/common';
import { Box, Button, CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';


export default function Tiktok() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [rows, setRows] = useState<any[]>([]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = evt.target?.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            // Get the sheet as a 2D array (rows and columns)
            const parsed: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // If the first row is a header, and you want to skip it, use: parsed.slice(1)
            const formatted = parsed.filter(row => row.length > 0); // remove empty rows

            setRows(formatted); // this will be your desired 2D array
        };
        reader.readAsBinaryString(file);
    };

    const wait = (ms: number): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };


    const onSubmit = async () => {
        setLoading(true);

        // const dataFacebook = extractPageAuthInfo(AccoutFacebook);

        // console.log('sdafsd', dataFacebook)
        // console.log('dsdffff', rows);

        // try {
        //     for (let i = 0; i < Math.min(rows.length, dataFacebook.length); i++) {
        //         const content = rows[i];
        //         const { page_access_token, page_id } = dataFacebook[i];
        //         const data = {
        //             pageAccessToken: page_access_token,
        //             pageId: page_id,
        //             fileName: i.toString() + '.mp4',
        //             tiktokUrl: content[0],
        //             description: content[1],
        //             commentText: content[2],
        //         };

        //         console.log('Processing item:', data);

        //         // Make the POST request to your API
        //         const response = await fetch('/api/clone-tiktok', {
        //             method: 'POST',
        //             headers: { 'Content-Type': 'application/json' },
        //             body: JSON.stringify(data),
        //         });

        //         const result = await response.json();
        //         console.log('Response:', result?.message);
        //         setMessage(result?.message || '');

        //         // Wait 5 seconds before the next iteration (skip delay on the last item)
        //         if (i < Math.min(rows.length, dataFacebook.length) - 1) {
        //             console.log('Waiting 5 seconds...');
        //             await wait(5000); // 5000ms = 5 seconds
        //         }
        //     }
        // } catch (error) {
        //     console.error("Error sending requests:", error);
        //     setMessage("Có lỗi xảy ra khi gửi dữ liệu.");
        // }

        setLoading(false);
    };


    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    return <>
        <CardItem>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            <Button onClick={() => onSubmit()} className="mt-2 bg-blue-600 px-3 py-1 text-white rounded">Gửi</Button>

            {message && <p>{message}</p>}
        </CardItem>
    </>
}
