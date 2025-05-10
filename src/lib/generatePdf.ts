// import PDFDocument from 'pdfkit';
// import fs from 'fs';

// type Item = {
//   fullName: string;
//   address: string;
//   region: { name: string };
//   ponpes: string;
// };

// type GroupedData = {
//   region: string;
//   data: Item[];
// };

// export function generateRegionPdf(
//   grouped: GroupedData[],
//   outputPath = 'output.pdf'
// ) {
//   const doc = new PDFDocument({ margin: 50 });

//   doc.pipe(fs.createWriteStream(outputPath));

//   doc
//     .fontSize(18)
//     .text('Daftar Santri per Region', { align: 'center' })
//     .moveDown();

//   grouped.forEach((group, index) => {
//     const region = group.region;
//     const data = group.data;

//     doc
//       .addPage()
//       .fontSize(16)
//       .fillColor('black')
//       .text(`Region: ${region}`, { underline: true })
//       .moveDown(0.5);

//     doc.fontSize(12).text(`Jumlah: ${data.length}`).moveDown(0.5);

//     // Tabel Header
//     doc
//       .font('Helvetica-Bold')
//       .text('No', 50, doc.y)
//       .text('Nama Lengkap', 100, doc.y)
//       .text('Alamat', 250, doc.y)
//       .text('Ponpes', 400, doc.y);

//     doc.moveDown(0.5).font('Helvetica');

//     data.forEach((item, i) => {
//       doc
//         .text(`${i + 1}`, 50, doc.y)
//         .text(item.fullName, 100, doc.y)
//         .text(item.address, 250, doc.y)
//         .text(item.ponpes, 400, doc.y);
//     });

//     doc.moveDown();
//   });

//   doc.end();
//   return doc;
// }

import PDFDocument from 'pdfkit';
import fs from 'fs';

type Item = {
  fullName: string;
  address: string;
  region: { name: string };
  ponpes: string;
};

type GroupedData = {
  region: string;
  data: Item[];
};

export function generateRegionPdf(
  grouped: GroupedData[],
  outputPath = 'output.pdf'
) {
  const doc = new PDFDocument({
    margin: 50,
    size: 'A4'
  });

  doc.pipe(fs.createWriteStream(outputPath));

  // Title
  doc
    .font('Helvetica-Bold')
    .fontSize(20)
    .fillColor('#1a237e')
    .text('Daftar Santri per Korwil', {
      align: 'center',
      lineGap: 2
    })
    .moveDown(1.5);

  grouped.forEach((group, index) => {
    const region = group.region;
    const data = group.data;

    if (index > 0) {
      doc.addPage();
    }

    // Region Header
    doc
      .font('Helvetica-Bold')
      .fontSize(16)
      .fillColor('#1565c0')
      .text(`Korwil: ${region}`, {
        underline: true,
        lineGap: 2
      })
      .moveDown(0.5);

    // Total Count
    doc
      .font('Helvetica')
      .fontSize(12)
      .fillColor('#333333')
      .text(`Jumlah Santri: ${data.length}`, {
        lineGap: 2
      })
      .moveDown(1);

    // Table Setup
    const tableTop = doc.y;
    const colWidths = [50, 150, 150, 150];
    const tableWidth = colWidths.reduce((sum, w) => sum + w, 0);
    const minRowHeight = 25;
    const padding = 7;

    // Calculate row heights based on content
    const rowHeights: number[] = [];
    doc.font('Helvetica').fontSize(10);

    // Header height
    rowHeights.push(minRowHeight);

    // Calculate height for each data row
    data.forEach((item) => {
      const texts = [
        `${rowHeights.length}`, // No
        item.fullName,
        item.address,
        item.ponpes
      ];
      let maxHeight = minRowHeight;

      texts.forEach((text, i) => {
        if (i > 0) {
          // Skip 'No' column
          const width = colWidths[i] - 10; // Account for padding
          const height = doc.heightOfString(text, { width });
          maxHeight = Math.max(maxHeight, height + padding * 2);
        }
      });
      rowHeights.push(maxHeight);
    });

    // Draw Table Border
    const tableHeight = rowHeights.reduce((sum, h) => sum + h, 0);
    doc
      .lineWidth(1)
      .strokeColor('#bdbdbd')
      .rect(50, tableTop, tableWidth, tableHeight)
      .stroke();

    // Table Header
    doc.font('Helvetica-Bold').fontSize(11).fillColor('#ffffff');

    // Header Background
    doc
      .rect(50, tableTop, tableWidth, rowHeights[0])
      .fill('#1976d2')
      .fillColor('#ffffff');

    // Header Text
    doc
      .text('No', 55, tableTop + padding)
      .text('Nama Lengkap', 105, tableTop + padding)
      .text('Alamat', 255, tableTop + padding)
      .text('Ponpes', 405, tableTop + padding);

    // Table Rows
    doc.font('Helvetica').fontSize(10).fillColor('#333333');

    let currentY = tableTop + rowHeights[0];
    data.forEach((item, i) => {
      const y = currentY;
      const rowHeight = rowHeights[i + 1];

      // Row Background (alternate colors)
      if (i % 2 === 0) {
        doc
          .rect(50, y, tableWidth, rowHeight)
          .fill('#f5f5f5')
          .fillColor('#333333');
      }

      // Vertical Lines
      let x = 50;
      colWidths.forEach((width, idx) => {
        if (idx < colWidths.length) {
          doc
            .moveTo(x + width, y)
            .lineTo(x + width, y + rowHeight)
            .strokeColor('#bdbdbd')
            .stroke();
        }
        x += width;
      });

      // Horizontal Line
      doc
        .moveTo(50, y)
        .lineTo(50 + tableWidth, y)
        .stroke();

      // Row Content
      doc
        .text(`${i + 1}`, 55, y + padding)
        .text(item.fullName, 105, y + padding, {
          width: colWidths[1] - 10,
          ellipsis: true
        })
        .text(item.address, 255, y + padding, {
          width: colWidths[2] - 10,
          ellipsis: true
        })
        .text(item.ponpes, 405, y + padding, {
          width: colWidths[3] - 10,
          ellipsis: true
        });

      currentY += rowHeight;
    });

    // Final Horizontal Line
    doc
      .moveTo(50, currentY)
      .lineTo(50 + tableWidth, currentY)
      .stroke();

    doc.y = currentY + 40; // Adjust spacing after table
  });

  // Footer
  doc
    .fontSize(10)
    .fillColor('#666666')
    .text(
      `Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`,
      50,
      doc.page.height - 50,
      {
        align: 'center'
      }
    );

  doc.end();
  return doc;
}
