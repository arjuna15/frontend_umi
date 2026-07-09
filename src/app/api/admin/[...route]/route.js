import { NextResponse } from 'next/server';

async function handleProxy(req, context, method) {
  try {
    const resolvedParams = await context.params;
    const route = resolvedParams?.route?.join('/') || '';
    const urlObj = new URL(req.url);
    const searchParams = urlObj.searchParams.toString();
    
    const apiUrl = process.env.BACKEND_API_URL || (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000/api' : 'https://backend.bikinwebdikitaaja.com/api');
    const backendUrl = `${apiUrl}/admin/${route}${searchParams ? '?' + searchParams : ''}`;
    
    const authHeader = req.headers.get('authorization');
    const headers = {};
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const contentType = req.headers.get('content-type') || '';
    
    let fetchOptions = {
      method,
      headers
    };
    
    if (method !== 'GET' && method !== 'HEAD') {
      if (contentType.includes('multipart/form-data')) {
        const formData = await req.formData();
        fetchOptions.body = formData;
      } else {
        const bodyText = await req.text();
        fetchOptions.body = bodyText;
        headers['Content-Type'] = contentType || 'application/json';
      }
    }
    
    const backendRes = await fetch(backendUrl, fetchOptions);
    const resContentType = backendRes.headers.get('content-type') || '';
    
    if (resContentType.includes('application/json')) {
      const data = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    } else {
      const text = await backendRes.text();
      return new NextResponse(text, {
        status: backendRes.status,
        headers: {
          'Content-Type': resContentType || 'text/html'
        }
      });
    }
  } catch (err) {
    return NextResponse.json({ message: 'Proxy Error: ' + err.message }, { status: 500 });
  }
}

export async function GET(req, context) {
  return handleProxy(req, context, 'GET');
}

export async function POST(req, context) {
  return handleProxy(req, context, 'POST');
}

export async function PUT(req, context) {
  return handleProxy(req, context, 'PUT');
}

export async function DELETE(req, context) {
  return handleProxy(req, context, 'DELETE');
}
