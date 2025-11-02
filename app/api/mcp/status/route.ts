import { NextResponse } from 'next/server';

const MCP_SERVER_URL = process.env.NEXT_PUBLIC_MCP_SERVER_URL || '';
const MCP_API_KEY = process.env.NEXT_PUBLIC_MCP_API_KEY || '';

export async function GET() {
  try {
    // Tenta fazer uma requisição simples ao servidor MCP
    const response = await fetch(MCP_SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        'X-API-Key': MCP_API_KEY,
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/list',
        id: Date.now(),
      }),
    });

    if (response.ok) {
      return NextResponse.json({ status: 'online', url: MCP_SERVER_URL });
    } else {
      return NextResponse.json({ status: 'offline', url: MCP_SERVER_URL }, { status: 503 });
    }
  } catch (error) {
    console.error('MCP server status check failed:', error);
    return NextResponse.json({ status: 'offline', url: MCP_SERVER_URL, error: 'Connection failed' }, { status: 503 });
  }
}
