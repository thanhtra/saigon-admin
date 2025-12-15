import { del, get, post } from '@/utils/apiClient';
import { getServer } from '@/utils/apiServer';
import { AffiliateCategoryInput } from '@/utils/type';
import { NextRequest, NextResponse } from 'next/server';

// Handle POST: Tạo mới affiliate category
export async function POST(req: NextRequest) {
    const body = await req.json() as AffiliateCategoryInput;
    const { name, type } = body;

    try {
        const res = await post(`/affiliate-category`, { name, type });
        return NextResponse.json(res, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

// Handle GET: Lấy danh sách affiliate categories với các params
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const params = {
        type: searchParams.get('type') || '',
        keySearch: searchParams.get('keySearch') || '',
        page: Number(searchParams.get('page')) || 0,
        size: Number(searchParams.get('size')) || 10,
    };

    try {
        const res = await getServer('/affiliate-category', params); // Gửi với params đúng định dạng
        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Handle DELETE: Xoá affiliate category theo id
export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ message: 'Missing affiliate category ID' }, { status: 400 });
    }

    try {
        const res = await del(`/affiliate-category/${id}`);
        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        console.error('Error deleting affiliate category:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
