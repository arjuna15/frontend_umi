import { NextResponse } from 'next/server';

export async function POST(req) {
  const response = NextResponse.json({ message: 'Logout berhasil' });
  
  response.cookies.set('siakad_token', '', {
    httpOnly: true,
    maxAge: 0, // Immediately delete the cookie
    path: '/'
  });
  
  return response;
}
