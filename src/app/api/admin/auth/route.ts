import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { password } = await request.json();

    if (password !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set('admin_auth', process.env.ADMIN_PASSWORD!, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge:   60 * 60 * 24 * 7, // 7 días
        path:     '/',
    });
    return res;
}

export async function DELETE() {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete('admin_auth');
    return res;
}
