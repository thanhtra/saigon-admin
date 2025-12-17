import { get, put } from '@/utils/request';
import { NextRequest, NextResponse } from 'next/server';

// GET: Lấy chi tiết danh mục Affiliate theo ID
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    try {
        const res = await get(`/affiliate-category/${params.id}`);
        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        console.error('Error fetching affiliate category detail:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// PUT: Cập nhật danh mục Affiliate
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const body = await req.json();

    try {

        const res = await put(`/affiliate-category/${params.id}`, body);
        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        console.error('Error updating affiliate category:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
