import { handleError } from '@/lib/error-handler';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const result = await prisma.division.findMany({});
  return NextResponse.json({ data: result });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await prisma.division.create({
      data: {
        name: body.name
      }
    });

    return NextResponse.json({
      message: 'division created',
      success: true,
      data: result
    });
  } catch (error) {
    // return handleError(error, 'create division');
    return Response.json(handleError(error, 'create devision'), {
      status: 500
    });
  }
}
