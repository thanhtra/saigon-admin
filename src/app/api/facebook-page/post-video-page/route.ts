import { post } from '@/utils/apiClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const res = await post('/facebook-page/post-video-page', {});
        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error creating Facebook page:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}