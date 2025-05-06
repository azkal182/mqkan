import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';
import { prisma } from '@/lib/prisma';
import { DateTime } from 'luxon';

function maskNumber(number: any) {
  const str = number.toString();
  const lastFive = str.slice(-5);
  return '***' + lastFive;
}

function pdfToStream(doc: PDFKit.PDFDocument): Readable {
  const stream = new Readable({ read() {} });
  doc.on('data', (chunk) => stream.push(chunk));
  doc.on('end', () => stream.push(null));
  doc.end();
  return stream;
}

function drawCell(
  doc: PDFKit.PDFDocument,
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
  options: {
    fontSize?: number;
    align?: 'left' | 'center' | 'right';
    isHeader?: boolean;
    isOddRow?: boolean;
  } = {}
) {
  const {
    fontSize = 7,
    align = 'left',
    isHeader = false,
    isOddRow = false
  } = options;

  // Set background colors
  if (isHeader) {
    doc.fillColor('#333333').rect(x, y, width, height).fill();
  } else if (isOddRow) {
    doc.fillColor('#f5f5f5').rect(x, y, width, height).fill();
  }

  // Draw border
  doc
    .fillColor('black')
    .strokeColor('black')
    .lineWidth(0.5)
    .rect(x, y, width, height)
    .stroke();

  // Calculate vertical centering
  const textY = y + (height - fontSize) / 2; // Center text vertically

  // Set text properties
  doc
    .font(isHeader ? 'Helvetica-Bold' : 'Helvetica')
    .fontSize(fontSize)
    .fillColor(isHeader ? 'white' : 'black')
    .text(text, x + 4, textY, {
      width: width - 8,
      height: height - 8,
      align
    });
}

export async function GET(req: NextRequest) {
  const regionId = req.nextUrl.searchParams.get('regionId');

  if (!regionId) {
    return NextResponse.json(
      { error: 'regionId is required' },
      { status: 400 }
    );
  }

  const participants = await prisma.participant.findMany({
    where: { regionId },
    include: {
      province: { select: { name: true } },
      regency: { select: { label: true } },
      district: { select: { name: true } },
      village: { select: { name: true } },
      region: { select: { name: true } },
      subKelas: {
        include: {
          kelas: { select: { name: true } }
        }
      }
    }
  });

  const doc = new PDFDocument({
    size: 'LEGAL',
    layout: 'landscape',
    margin: 30
  });

  // Register Helvetica font
  doc.registerFont('Helvetica', 'Helvetica');
  doc.registerFont('Helvetica-Bold', 'Helvetica-Bold');

  // Title
  doc
    .font('Helvetica-Bold')
    .fontSize(14)
    .fillColor('black')
    .text(
      `Daftar Peserta MQKAN- Region ${participants[0]?.region?.name || ''}`,
      {
        align: 'center',
        underline: true
      }
    );

  doc.moveDown(1);

  const headers = [
    'No',
    'Nama Lengkap',
    'No. Registrasi',
    'NIK',
    'Tempat, Tgl Lahir',
    'JK',
    'HP Ortu',
    'Alamat',
    'Desa',
    'Kecamatan',
    'Kab/Kota',
    'Kelas/Sub',
    'Lembaga'
  ];

  // Column widths to span full page width (948 points)
  const colWidths = [30, 100, 80, 70, 100, 30, 70, 100, 70, 70, 70, 80, 60];
  const rowHeight = 45;
  const startX = doc.page.margins.left;
  let y = doc.y;

  // Header
  headers.forEach((header, i) => {
    const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
    drawCell(doc, header, x, y, colWidths[i], rowHeight, {
      fontSize: 8,
      align: 'center',
      isHeader: true
    });
  });

  y += rowHeight;

  // Rows
  participants.forEach((p, idx) => {
    const row = [
      { text: (idx + 1).toString(), align: 'center' },
      { text: p.fullName, align: 'left' },
      { text: p.noRegistration, align: 'left' },
      { text: maskNumber(p.nik), align: 'left' },

      {
        text: `${p.birthPlace}, ${DateTime.fromJSDate(new Date(p.birthDate))
          .setZone('Asia/Jakarta')
          .toFormat('dd-MM-yyyy')}`,
        align: 'left'
      },
      { text: p.gender === 'PUTRA' ? 'L' : 'P', align: 'center' },
      { text: p.parentPhone, align: 'left' },
      { text: p.address, align: 'left' },
      { text: p.village?.name || '', align: 'left' },
      { text: p.district?.name || '', align: 'left' },
      { text: p.regency?.label || '', align: 'left' },
      {
        text: `${p.subKelas?.kelas?.name || ''} / ${p.subKelas?.name || ''}`,
        align: 'left'
      },
      { text: p.institutionName || '', align: 'left' }
    ];

    row.forEach(({ text, align }, i) => {
      const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
      // @ts-ignore
      drawCell(doc, text, x, y, colWidths[i], rowHeight, {
        fontSize: 7,
        align,
        isOddRow: idx % 2 === 0
      });
    });

    y += rowHeight;

    // Add new page if needed
    if (y > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
      y = doc.page.margins.top;

      // Redraw headers on new page
      headers.forEach((header, i) => {
        const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
        drawCell(doc, header, x, y, colWidths[i], rowHeight, {
          fontSize: 8,
          align: 'center',
          isHeader: true
        });
      });
      y += rowHeight;
    }
  });

  const stream = pdfToStream(doc);

  return new NextResponse(stream as any, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=participants-${regionId}.pdf`
    }
  });
}
