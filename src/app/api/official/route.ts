// app/api/official/route.ts

// import { createOfficial } from '@/actions/official-action';

import { createOfficial, updateOfficial } from '@/actions/official-action';
import {
  OfficialFormDataEdit,
  officialSchemaCreate,
  officialSchemaEdit
} from '@/schemas/official-schema';
import { NextRequest, NextResponse } from 'next/server';

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();

//     const getString = (key: string) => formData.get(key)?.toString() || '';
//     const getAggree = (key: string) => {
//       // Mengonversi nilai ke boolean
//       return formData.get(key) === 'true';
//     };
//     const getRequiredFile = (key: string): File => {
//       const file = formData.get(key);
//       if (!file || !(file instanceof File)) {
//         throw new Error(`File ${key} is required`);
//       }
//       return file;
//     };

//     const data: OfficialFormData = {
//       fullName: getString('fullName'),
//       address: getString('address'),
//       phone: getString('phone'),
//       regionId: getString('regionId'),
//       aggree: getAggree('aggree'),
//       photo: getRequiredFile('photo')
//     };

//     const result = await createOfficial(data);
//     return NextResponse.json(
//       {
//         message: 'Data berhasil diterima',
//         result
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     // Tangani kesalahan validasi dari Zod
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         {
//           error: error.errors
//         },
//         { status: 400 }
//       );
//     }

//     // Tangani error lain
//     return NextResponse.json(
//       {
//         error: 'Terjadi kesalahan server.'
//       },
//       { status: 500 }
//     );
//   }
// }

// async function createOfficial(data: z.infer<typeof officialSchema>) {
//   // Simpan data ke database
//   console.log('create data', data);
//   return { success: true, message: 'Data berhasil disimpan' };
// }

// async function editOfficial(id: string, data: OfficialFormDataEdit) {
//   // Update data berdasarkan id
//   console.log('edit data', id, data);
//   return { success: true, message: `Data dengan id ${id} berhasil diperbarui` };
// }

// Registrasi - POST
export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const data = {
    fullName: formData.get('fullName'),
    address: formData.get('address'),
    phone: formData.get('phone'),
    aggree: formData.get('aggree') === 'true',
    regionId: formData.get('regionId'),
    photo: formData.get('photo')
  };

  const result = officialSchemaCreate.safeParse(data);

  if (!result.success) {
    return NextResponse.json(
      { success: false, errors: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const res = await createOfficial(result.data);
    return NextResponse.json(res);
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Gagal menyimpan data' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const formData = await req.formData();

  const id = formData.get('id');
  if (!id || typeof id !== 'string') {
    return NextResponse.json(
      { success: false, message: 'ID tidak valid' },
      { status: 400 }
    );
  }

  const photo = formData.get('photo');

  const data: Record<string, any> = {
    id: id,
    fullName: formData.get('fullName'),
    address: formData.get('address'),
    phone: formData.get('phone'),
    aggree: formData.get('aggree') === 'true',
    regionId: formData.get('regionId')
  };

  // ✅ Hanya tambahkan photo jika dikirim (bukan string kosong)
  if (photo && photo instanceof File && photo.size > 0) {
    data.photo = photo;
  }

  const result = officialSchemaEdit.safeParse(data);

  // await createOfficial(result.data);
  if (!result.success) {
    return NextResponse.json(
      { success: false, errors: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const res = await updateOfficial(id, result.data);
    return NextResponse.json(res);
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui data' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const data = await prisma?.official.findMany({});
  return NextResponse.json({ data });
}
