import { NextResponse } from 'next/server';

// Force Node.js runtime (bcryptjs uses setImmediate which is not available in Edge)
export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: 'Database not configured. Set DATABASE_URL in environment.' },
      { status: 503 }
    );
  }

  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Dynamic imports to avoid build-time crashes when env vars are missing
    const { db } = await import('@/lib/db');
    const { users } = await import('@/lib/schema');
    const { eq } = await import('drizzle-orm');
    const bcrypt = (await import('bcryptjs')).default;

    // Check if user already exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        email,
        name: name || null,
        hashedPassword,
      })
      .returning();

    // Send welcome email (non-blocking — don't fail signup if email fails)
    try {
      const { sendWelcomeEmail } = await import('@/lib/email');
      await sendWelcomeEmail(email, name || undefined);
    } catch (emailErr) {
      console.warn('Welcome email failed (signup still succeeded):', emailErr);
    }

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
