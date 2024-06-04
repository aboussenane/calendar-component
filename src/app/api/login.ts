import type { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  const { username, password } = req.body;

  try {
    const { rows } = await sql`
      SELECT id FROM users WHERE username = ${username} AND password = ${password}
    `;
    if (rows.length > 0) {
      res.status(200).json({ userId: rows[0].id });
    } else {
      res.status(401).json({ message: 'Invalid login details' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}