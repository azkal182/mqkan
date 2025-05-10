// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // const id = param.id;
//     const { id } = await params;

//     // Validasi ID
//     if (!id) {
//       return NextResponse.json(
//         { error: 'Official ID is required' },
//         { status: 400 }
//       );
//     }

//     // Cek apakah user ada
//     const user = await prisma.official.findUnique({
//       where: { id: id }
//     });

//     if (!user) {
//       return NextResponse.json(
//         { error: 'Official not found' },
//         { status: 404 }
//       );
//     }

//     // Hapus user
//     await prisma.official.delete({
//       where: { id: id }
//     });

//     return NextResponse.json(
//       { message: 'Official deleted successfully' },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error deleting official:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Langsung destructure params untuk mendapatkan id
    const { id } = await params;

    // Validasi ID
    if (!id) {
      return NextResponse.json(
        { error: 'Official ID is required' },
        { status: 400 }
      );
    }

    // Cek apakah user ada
    const user = await prisma.official.findUnique({
      where: { id }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Official not found' },
        { status: 404 }
      );
    }

    // Hapus user
    await prisma.official.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Official deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting official:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
