import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const password = searchParams.get('password');

  try {
    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    const { rows } = await sql`
      SELECT id FROM users WHERE username = ${username} AND password = ${password}
    `;
    if (rows.length > 0) {
      return NextResponse.json({ userId: rows[0].id }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid login details' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}