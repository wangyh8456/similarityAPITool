import { withAuth } from 'next-auth/middleware';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const redis = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_SECRET
})

const limitRate = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h')
})

export default withAuth(
    async function middleware(req) {
        const pathname = req.nextUrl.pathname;

        //Manage rate limiting
        if (pathname.startsWith('/api')) {
            const ip = req.ip ?? '127.0.0.1';
            try {
                const { success } = await limitRate.limit(ip);

                if (!success) return NextResponse.json({ error: 'Too many requests' });
                return NextResponse.next();
            } catch (error) {
                return NextResponse.json({ error: 'Internal server error' });
            }
        }

        //Manage route protection
        const token = await getToken({ req });
        const isAuth = !!token;

        const isAuthPage = pathname.startsWith('/login');
        const sensitiveRoutes = ['/dashboard'];

        if (isAuthPage) {
            if (isAuth) return NextResponse.redirect(new URL('/dashboard', req.url));
        }
        if (!isAuth && sensitiveRoutes.some(route => pathname.startsWith(route))) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

    }, {
    callbacks: {
        async authorized() {
            return true;
        }
    }
}
)

export const config = {
    matcher: ['/', '/login', '/dashboard/:path*', '/api/:path*']
}