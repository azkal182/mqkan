import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { prisma } from '@/lib/prisma';

// Contoh tipe data
interface Person {
  fullname: string;
  parrentname: string;
  gender: 'Male' | 'Female';
}

// Handler untuk GET request
export async function GET(req: NextRequest) {
  try {
    // Contoh data (ganti dengan data dari database atau sumber lain)
    const participant = await prisma.participant.findMany({
      select: {
        fullName: true,
        fatherName: true,
        gender: true
      }
    });
    const data: Person[] = [
      { fullname: 'John Doe', parrentname: 'Michael Doe', gender: 'Male' },
      { fullname: 'Jane Smith', parrentname: 'Robert Smith', gender: 'Female' },
      { fullname: 'Mike Wilson', parrentname: 'James Wilson', gender: 'Male' },
      {
        fullname: 'Sarah Brown',
        parrentname: 'William Brown',
        gender: 'Female'
      }
    ];

    // Pisahkan data berdasarkan gender
    const maleData = participant.filter((item) => item.gender === 'PUTRA');
    const femaleData = participant.filter((item) => item.gender === 'PUTRI');

    // Buat worksheet untuk masing-masing gender
    const maleWorksheet = XLSX.utils.json_to_sheet(maleData);
    const femaleWorksheet = XLSX.utils.json_to_sheet(femaleData);

    // Buat workbook baru
    const workbook = XLSX.utils.book_new();

    // Tambahkan worksheet ke workbook
    XLSX.utils.book_append_sheet(workbook, maleWorksheet, 'PUTRA');
    XLSX.utils.book_append_sheet(workbook, femaleWorksheet, 'PUTRI');

    // Generate buffer untuk file Excel
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'buffer'
    });

    // Set header untuk response
    const headers = new Headers();
    headers.set(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    headers.set(
      'Content-Disposition',
      'attachment; filename="data_export.xlsx"'
    );

    // Return response dengan file Excel
    return new NextResponse(excelBuffer, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error generating Excel:', error);
    return NextResponse.json(
      { error: 'Failed to generate Excel file' },
      { status: 500 }
    );
  }
}
