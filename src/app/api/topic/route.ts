import { del, get, post } from '@/utils/apiClient';
import { TopicInput } from '@/utils/type';
import { NextRequest, NextResponse } from 'next/server';

// Handle POST: Tạo mới topic
export async function POST(req: NextRequest) {
    const body = await req.json() as TopicInput;
    const { name, description, type } = body;

    try {
        const res = await post(`/topic`, { name, description, type });
        return NextResponse.json(res, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const params = {
        type: searchParams.get('type') || '',
        key_search: searchParams.get('key_search') || '',
        page: Number(searchParams.get('page')) || 0,
        size: Number(searchParams.get('size')) || 10,
    };

    try {
        const res = await get('/topic', params); // Gửi với params đúng định dạng
        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Handle DELETE: Xoá topic theo id
export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ message: 'Missing topic ID' }, { status: 400 });
    }

    try {
        const res = await del(`/topic/${id}`);
        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        console.error('Error deleting topic:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}