import { del, get, post } from '@/utils/apiClient';
import { GroupFacebookPayload } from '@/utils/type';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as GroupFacebookPayload;
        const { topic_id, groups } = body;
        const res = await post('/group-facebook', { topic_id, groups });

        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        console.error('Error creating group facebook:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const params = {
            topic_id: searchParams.get('topic_id') || '',
            keySearch: searchParams.get('keySearch') || '',
            page: Number(searchParams.get('page') || '1'),
            size: Number(searchParams.get('size') || '10'),
        };

        const res = await get('/group-facebook', params);
        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        console.error('Error fetching group facebook:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}


export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get('id');

    if (!groupId) {
        return NextResponse.json({ message: 'Missing groupId' }, { status: 400 });
    }

    try {
        const res = await del(`/group-facebook/${groupId}`);
        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        console.error('Error deleting group facebook:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
