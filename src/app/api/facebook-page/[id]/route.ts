import { get, put } from '@/utils/request';
import { NextRequest, NextResponse } from 'next/server';

// GET: Lấy chi tiết fanpage theo ID
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    try {
        const res = await get(`/facebook-page/${params.id}`);
        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        console.error('Error fetching Facebook page detail:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// PUT: Cập nhật fanpage
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const body = await req.json();

    try {
        const res = await put(`/facebook-page/${params.id}`, body);
        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        console.error('Error updating Facebook page:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
