import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export const config = {
  matcher: ['/chats/:path*', '/'], // Match both /chats and /
};

export async function middleware(request) {
  // Extract and parse cookies
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(cookie => {
      const [name, ...rest] = cookie.split('=');
      return [name.trim(), rest.join('=')];
    })
  );

  const token = cookies['token']; // Extract token from cookies

  console.log('Requested URL:', request.nextUrl.pathname);
  console.log('Token:', token);
  console.log('JWT_SECRET:', process.env.JWT_SECRET);

  // Handle access to the root page (/)
  if (request.nextUrl.pathname === '/') {
    if (token) {
      try {
        // Verify the token using jose
        const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
        console.log('Decoded Token:', payload);
        console.log('Token is valid, redirecting to /chats');
        return NextResponse.redirect(new URL('/chats', request.url)); // Redirect to /chats
      } catch (error) {
        console.error('Token verification failed:', error.message);
        return NextResponse.next(); // Token is invalid, continue to / page
      }
    }
  }

  // Handle access to the /chats page
  if (request.nextUrl.pathname.startsWith('/chats')) {
    if (!token) {
      console.log('No token found, redirecting to /');
      return NextResponse.redirect(new URL('/', request.url)); // Redirect to root page
    }

    try {
      // Verify the token using jose
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      console.log('Decoded Token:', payload);
      console.log('Token is valid, allowing access to /chats');
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return NextResponse.redirect(new URL('/', request.url)); // Token is invalid, redirect to root page
    }
  }

  // Allow access to the requested page if all checks pass
  console.log('Allowing access to:', request.nextUrl.pathname);
  return NextResponse.next();
}
