import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateRegionPdf } from '@/lib/generatePdf';

export async function GET(req: NextRequest) {
  const data = await prisma.participant.findMany({
    where: {
      statusRegion: false
    },
    select: {
      fullName: true,
      address: true,
      institutionName: true,
      region: {
        select: {
          name: true
        }
      }
    }
  });

  const grouped = Object.values(
    data.reduce((acc, curr) => {
      const regionName = curr.region.name;

      // Ubah institutionName menjadi ponpes
      const transformed = {
        ...curr,
        ponpes: curr.institutionName
      };
      //   @ts-ignore
      delete transformed.institutionName;
      //   @ts-ignore
      if (!acc[regionName]) {
        //   @ts-ignore
        acc[regionName] = {
          region: regionName,
          data: []
        };
      }
      //   @ts-ignore
      acc[regionName].data.push(transformed);
      return acc;
    }, {})
  );
  //   const grouped = [
  //     {
  //       region: 'Lombok',
  //       data: [
  //         {
  //           fullName: 'Muhammad imtiyaz zayyan ',
  //           address: 'Gang masjid aikmel',
  //           region: { name: 'Lombok' },
  //           ponpes: 'Zainul hafidz at-taufiq'
  //         }
  //       ]
  //     },
  //     {
  //       region: 'Jatim 5',
  //       data: [
  //         {
  //           fullName: 'M. Ziddan sofwar rochman',
  //           address: 'Kawatan Rw03 Rt06, kedungcangkring, jabon, sidoarjo',
  //           region: { name: 'Jatim 5' },
  //           ponpes: 'PP. Roudlotul Mutaallimin 2'
  //         }
  //       ]
  //     }
  //   ];
  // @ts-ignore
  const doc = generateRegionPdf(grouped);

  const buffer = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=daftar-belum-validasi.pdf'
    }
  });

  //   return NextResponse.json(grouped);
}
