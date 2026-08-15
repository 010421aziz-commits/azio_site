import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = process.env.JWT_SECRET;
if (!secret) throw new Error('JWT_SECRET is required');
const key = new TextEncoder().encode(secret);

export async function middleware(req: NextRequest) {
	const token = req.cookies.get('qa_token')?.value;
	if (!token) return NextResponse.redirect(new URL('/dashboard/login', req.url));
	try {
		await jwtVerify(token, key);
		return NextResponse.next();
	} catch {
		return NextResponse.redirect(new URL('/dashboard/login', req.url));
	}
}

export const config = { matcher: ['/dashboard', '/dashboard/((?!login).*)'] };
