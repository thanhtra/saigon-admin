import { post } from '@/utils/request';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const res = await post('/facebook-page/update-token', {});
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error updating Facebook token:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
