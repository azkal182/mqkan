import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // sesuaikan dengan path prisma kamu

export async function POST(req: Request) {
  try {
    const { id, division } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }
    if (!division) {
      return NextResponse.json(
        { error: 'division diperlukan' },
        { status: 400 }
      );
    }

    await prisma.participant.update({
      where: { id },
      data: {
        statusRegion: true
      }
    });

    return NextResponse.json({ success: true, id, division });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Gagal memvalidasi peserta' },
      { status: 500 }
    );
  }
}
