import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const title = searchParams.get('title');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const type = searchParams.get('type');

  try {
    if (!userId || !title || !startDate || !endDate || !type) {
      throw new Error('All booking details are required');
    }
    await sql`INSERT INTO bookings (user_id, title, start_date, end_date, type) VALUES (${userId}, ${title}, ${startDate}, ${endDate}, ${type});`;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const bookings = await sql`SELECT * FROM bookings WHERE user_id = ${userId};`;
  return NextResponse.json({ bookings }, { status: 200 });
}