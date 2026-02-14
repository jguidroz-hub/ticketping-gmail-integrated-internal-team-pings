// @ts-nocheck
export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const { email, password, name } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL);
    const bcrypt = (await import('bcryptjs')).default;

    // Check existing
    const existing = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase().trim()} LIMIT 1`;
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Account already exists' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const hashed = await bcrypt.hash(password, 10);
    
    await sql`INSERT INTO users (id, email, name, hashed_password) VALUES (${id}, ${email.toLowerCase().trim()}, ${name || null}, ${hashed})`;

    return NextResponse.json({ user: { id, email: email.toLowerCase().trim(), name } });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Failed to create account: ' + (error.message || 'unknown') }, { status: 500 });
  }
}
