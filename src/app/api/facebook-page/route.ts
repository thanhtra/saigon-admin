import { get, post, del } from '@/utils/apiClient';
import { FacebookPageInput } from '@/utils/type';
import { NextRequest, NextResponse } from 'next/server';


// POST /api/facebook
export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as FacebookPageInput;
        const { page_id, page_name, page_access_token, topic_id, facebook_id } = body;

        const res = await post('/facebook-page', {
            page_id,
            page_name,
            page_access_token,
            topic_id,
            facebook_id,
        });

        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        console.error('Error creating Facebook page:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET /api/facebook?topic_id=...&facebook_id=...&keySearch=...&page=1&size=10

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const params = {
            topic_id: searchParams.get('topic_id') || '',
            facebook_id: searchParams.get('facebook_id') || '',
            keySearch: searchParams.get('keySearch') || '',
            page: Number(searchParams.get('page') || '1'),
            size: Number(searchParams.get('size') || '10'),
        };

        const res = await get('/facebook-page', params);
        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        console.error('Error fetching Facebook pages:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}


// DELETE /api/facebook?page_id=...
export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const page_id = searchParams.get('page_id');

    if (!page_id) {
        return NextResponse.json({ message: 'Missing page_id' }, { status: 400 });
    }

    try {
        const res = await del(`/facebook-page/${page_id}`);
        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        console.error('Error deleting Facebook page:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
