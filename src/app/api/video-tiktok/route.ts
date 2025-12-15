// app/api/video-tiktok/route.ts

import { TiktokVideoInput } from '@/hooks/TiktokVideo/useCreateTiktokVideo';
import { NextRequest, NextResponse } from 'next/server';
import { post, get, del } from '@/utils/apiClient';

interface CreateTiktokVideoRequest {
    is_priority: boolean;
    topic_id: string;
    videos: TiktokVideoInput[];
}

// POST /api/video-tiktok
export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as CreateTiktokVideoRequest;
        const { is_priority, topic_id, videos } = body;

        if (!topic_id || !videos || !Array.isArray(videos) || videos.length === 0) {
            return NextResponse.json({ message: 'Invalid input data' }, { status: 400 });
        }

        const res = await post('/video-tiktok', { is_priority, topic_id, videos });
        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        console.error('Error creating TikTok videos:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// app/api/video-tiktok/route.ts

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const params = {
            topic_id: searchParams.get('topic_id') || '',
            keySearch: searchParams.get('keySearch') || '',
            page: Number(searchParams.get('page') || '1'),
            size: Number(searchParams.get('size') || '10'),
        };

        const res = await get('/video-tiktok', params);
        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        console.error('Error fetching TikTok videos:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// app/api/video-tiktok/route.ts

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const video_id = searchParams.get('video_id');

    if (!video_id) {
        return NextResponse.json({ message: 'Missing video_id' }, { status: 400 });
    }

    try {
        const res = await del(`/video-tiktok/${video_id}`);
        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        console.error('Error deleting TikTok video:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
