import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { nim_nip, password } = await req.json();
    const apiUrl = process.env.BACKEND_API_URL || 'http://127.0.0.1:8000/api';
    
    const backendRes = await fetch(`${apiUrl}/siakad/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nim_nip, password })
    });
    
    const data = await backendRes.json();
    
    if (!backendRes.ok) {
      return NextResponse.json({ message: data.message || 'Login gagal.' }, { status: backendRes.status });
    }
    
    const token = data.token;
    
    const response = NextResponse.json({
      user: data.user
    });
    
    response.cookies.set('siakad_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });
    
    return response;
  } catch (err) {
    return NextResponse.json({ message: 'Terjadi kesalahan sistem: ' + err.message }, { status: 500 });
  }
}
