// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export function middleware(req: NextRequest) {
    const token = req.cookies.get('accessToken')?.value;
    const { pathname } = req.nextUrl;

    if (
        pathname.startsWith('/login') ||
        pathname.startsWith('/auth')
    ) {
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}


export const config = {
    matcher: ['/((?!api|_next|favicon.ico).*)'],
};
