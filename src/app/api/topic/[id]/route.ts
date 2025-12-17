import { get, put } from '@/utils/request';
import { NextRequest, NextResponse } from 'next/server';

// GET: Lấy chi tiết chủ đề theo ID
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    try {
        const res = await get(`/topic/${params.id}`);
        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        console.error('Error fetching topic detail:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// PUT: Cập nhật chủ đề
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const body = await req.json();

    try {
        const res = await put(`/topic/${params.id}`, body);
        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        console.error('Error updating topic:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
