import { get } from '@/utils/apiClient';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const params = {
            type: searchParams.get('type') || '',
        };

        const res = await get('/check-data', params);
        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        console.error('Error check data:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}