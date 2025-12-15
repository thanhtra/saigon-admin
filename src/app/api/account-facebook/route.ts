import { del, get, post } from '@/utils/apiClient';
import { AccountFacebook } from '@/utils/type';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as AccountFacebook;
        const { facebook_id, name, gmail, active } = body;

        const res = await post('/account-facebook', { facebook_id, name, gmail, active });

        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        console.error('Error creating:', error);
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
            keySearch: searchParams.get('keySearch') || '',
            page: Number(searchParams.get('page') || '1'),
            size: Number(searchParams.get('size') || '10'),
        };

        const res = await get('/account-facebook', params);
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
// export async function DELETE(req: NextRequest) {
//     const { searchParams } = new URL(req.url);
//     const page_id = searchParams.get('page_id');

//     if (!page_id) {
//         return NextResponse.json({ message: 'Missing page_id' }, { status: 400 });
//     }

//     try {
//         const res = await del(`/account-facebook/${page_id}`);
//         return NextResponse.json(res, { status: 200 });
//     } catch (error) {
//         console.error('Error deleting Facebook page:', error);
//         return NextResponse.json(
//             { message: 'Internal server error' },
//             { status: 500 }
//         );
//     }
// }
