import PDFDocument from 'pdfkit';
import { DateTime } from 'luxon';

function maskNumber(number: any) {
  const str = number.toString();
  const lastFive = str.slice(-5);
  return '***' + lastFive;
}

export function pdfToBuffer(doc: PDFKit.PDFDocument): Promise<Buffer> {
  return new Promise((resolve) => {
    const buffers: Buffer[] = [];
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.end();
  });
}

function calculateTextHeight(
  doc: PDFKit.PDFDocument,
  text: string,
  width: number,
  fontSize: number,
  font: string
): number {
  doc.font(font).fontSize(fontSize);
  const height = doc.heightOfString(text, { width: width - 8, align: 'left' });
  return height + 8; // Add padding
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

  // Set text properties
  const font = isHeader ? 'Helvetica-Bold' : 'Helvetica';
  doc
    .font(font)
    .fontSize(fontSize)
    .fillColor(isHeader ? 'white' : 'black');

  // Calculate text height for vertical centering
  const textHeight = doc.heightOfString(text, { width: width - 8, align });
  const textY = y + (height - textHeight) / 2; // Vertically center the text

  // Draw text with wrapping
  doc.text(text, x + 4, textY, {
    width: width - 8,
    height: height - 8,
    align,
    lineBreak: true
  });
}

export function createRegionPDF(
  participants: any[],
  regionName: string
): PDFKit.PDFDocument {
  const doc = new PDFDocument({
    size: 'LEGAL',
    layout: 'landscape',
    margin: 30
  });

  doc.registerFont('Helvetica', 'Helvetica');
  doc.registerFont('Helvetica-Bold', 'Helvetica-Bold');

  // Header Dokumen
  doc
    .font('Helvetica-Bold')
    .fontSize(14)
    .fillColor('black')
    .text(`Daftar Peserta MQKAN - Region ${regionName || ''}`, {
      align: 'center',
      underline: true
    });

  doc.moveDown(1);

  // Kolom Tabel
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

  const colWidths = [30, 100, 80, 70, 100, 30, 70, 100, 70, 70, 70, 80, 60];
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);
  const baseRowHeight = 20;
  const startX = doc.page.margins.left;
  let y = doc.y;

  // Fungsi untuk Header Grup
  function drawGroupHeader(
    text: string,
    yPos: number,
    height: number,
    bgColor: string,
    indent: number = 0
  ) {
    // Background
    doc.fillColor(bgColor).rect(startX, yPos, totalWidth, height).fill();

    // Border
    doc
      .strokeColor('black')
      .lineWidth(0.5)
      .rect(startX, yPos, totalWidth, height)
      .stroke();

    // Text
    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .fillColor('black')
      .text(
        text,
        startX + 4 + indent,
        yPos + (height - doc.currentLineHeight()) / 2,
        {
          width: totalWidth - 8 - indent,
          align: 'left'
        }
      );
  }

  // Grouping Data
  const grouped = participants.reduce((acc: any, p) => {
    const kelas = p.subKelas?.kelas?.name || 'Tidak Diketahui';
    const subkelas = p.subKelas?.name || 'Tidak Diketahui';
    const gender = p.gender;

    if (!acc[kelas]) acc[kelas] = {};
    if (!acc[kelas][subkelas]) acc[kelas][subkelas] = {};
    if (!acc[kelas][subkelas][gender]) acc[kelas][subkelas][gender] = [];

    acc[kelas][subkelas][gender].push(p);
    return acc;
  }, {});

  let rowNumber = 1;

  // Draw Column Headers
  function drawColumnHeaders(currentY: number) {
    const headerHeight = headers.reduce((maxHeight, header, i) => {
      const textHeight = calculateTextHeight(
        doc,
        header,
        colWidths[i],
        8,
        'Helvetica-Bold'
      );
      return Math.max(maxHeight, textHeight);
    }, baseRowHeight);

    headers.forEach((header, i) => {
      const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
      drawCell(doc, header, x, currentY, colWidths[i], headerHeight, {
        fontSize: 8,
        align: 'center',
        isHeader: true
      });
    });

    return headerHeight;
  }

  // Initial Column Headers
  let columnHeaderHeight = drawColumnHeaders(y);
  y += columnHeaderHeight;

  // Process Each Group
  Object.entries(grouped).forEach(([kelasName, subkelasGroups]) => {
    // Kelas Header
    const kelasHeaderHeight = 20;
    if (y + kelasHeaderHeight > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
      y = doc.page.margins.top;
      columnHeaderHeight = drawColumnHeaders(y);
      y += columnHeaderHeight;
    }

    drawGroupHeader(`KELAS: ${kelasName}`, y, kelasHeaderHeight, '#eeeeee');
    y += kelasHeaderHeight;

    Object.entries(subkelasGroups as object).forEach(
      ([subkelasName, genderGroups]) => {
        // Subkelas Header
        const subkelasHeaderHeight = 18;
        if (
          y + subkelasHeaderHeight >
          doc.page.height - doc.page.margins.bottom
        ) {
          doc.addPage();
          y = doc.page.margins.top;
          columnHeaderHeight = drawColumnHeaders(y);
          y += columnHeaderHeight;
        }

        drawGroupHeader(
          `Subkelas: ${subkelasName}`,
          y,
          subkelasHeaderHeight,
          '#f5f5f5',
          4
        );
        y += subkelasHeaderHeight;

        Object.entries(genderGroups as object).forEach(
          ([gender, groupParticipants]) => {
            // Gender Header
            const genderHeaderHeight = 16;
            const genderLabel = gender === 'PUTRA' ? 'Laki-laki' : 'Perempuan';

            if (
              y + genderHeaderHeight >
              doc.page.height - doc.page.margins.bottom
            ) {
              doc.addPage();
              y = doc.page.margins.top;
              columnHeaderHeight = drawColumnHeaders(y);
              y += columnHeaderHeight;
            }

            drawGroupHeader(
              `Jenis Kelamin: ${genderLabel}`,
              y,
              genderHeaderHeight,
              '#fafafa',
              8
            );
            y += genderHeaderHeight;

            // Process Participants
            (groupParticipants as any[]).forEach((p) => {
              const rowData = [
                { text: rowNumber.toString(), align: 'center' },
                { text: p.fullName, align: 'left' },
                { text: p.noRegistration, align: 'left' },
                { text: maskNumber(p.nik), align: 'left' },
                {
                  text: `${p.birthPlace}, ${DateTime.fromJSDate(
                    new Date(p.birthDate)
                  )
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
                  text: `${p.subKelas?.kelas?.name || ''}/${p.subKelas?.name || ''}`,
                  align: 'left'
                },
                { text: p.institutionName || '', align: 'left' }
              ];

              // Calculate row height
              let rowHeight = baseRowHeight;
              rowData.forEach(({ text }, i) => {
                const textHeight = calculateTextHeight(
                  doc,
                  text,
                  colWidths[i],
                  7,
                  'Helvetica'
                );
                rowHeight = Math.max(rowHeight, textHeight);
              });

              // Check page break
              if (y + rowHeight > doc.page.height - doc.page.margins.bottom) {
                doc.addPage();
                y = doc.page.margins.top;
                columnHeaderHeight = drawColumnHeaders(y);
                y += columnHeaderHeight;
              }

              // Draw row cells
              rowData.forEach(({ text, align }, i) => {
                const x =
                  startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
                drawCell(doc, text, x, y, colWidths[i], rowHeight, {
                  fontSize: 7,
                  align: align as 'left' | 'center' | 'right',
                  isOddRow: rowNumber % 2 === 0
                });
              });

              y += rowHeight;
              rowNumber++;
            });
          }
        );
      }
    );
  });

  return doc;
}
