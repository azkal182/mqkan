import { handleError } from '@/lib/error-handler';
import { createRegistration } from '@/lib/registration';
import { RegistrationInput } from '@/schemas/registration-schema';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const getString = (key: string) => formData.get(key)?.toString() || '';
    const getRequiredFile = (key: string): File => {
      const file = formData.get(key);
      if (!file || !(file instanceof File)) {
        throw new Error(`File ${key} is required`);
      }
      return file;
    };

    const getNumber = (key: string) => {
      const value = formData.get(key);
      if (!value) throw new Error(`Field ${key} is required`);
      const number = Number(value);
      if (isNaN(number)) throw new Error(`Field ${key} must be a number`);
      return number;
    };

    const data: RegistrationInput = {
      fullName: getString('fullName'),
      nik: getString('nik'),
      birthPlace: getString('birthPlace'),
      birthDate: getString('birthDate'),
      gender: getString('gender') as 'PUTRA' | 'PUTRI',
      subKelasId: getString('subKelasId'),
      kelasId: getString('kelasId'),
      institutionName: getString('institutionName'),
      institutionAddress: getString('institutionAddress'),
      regionId: getString('regionId'),
      provinceId: getNumber('provinceId'),
      regencyId: getNumber('regencyId'),
      districtId: getNumber('districtId'),
      villageId: getNumber('villageId'),
      postalCode: getString('postalCode'),
      address: getString('address'),
      fatherName: getString('fatherName'),
      motherName: getString('motherName'),
      parentPhone: getString('parentPhone'),
      kk: getRequiredFile('kk'),
      sk: getRequiredFile('sk'),
      ijazah: getRequiredFile('ijazah'),
      photo: getRequiredFile('photo')
    };

    const result = await createRegistration(data);

    return Response.json(result);
  } catch (error) {
    // console.error(error);
    return Response.json(handleError(error, 'createParticipant'), {
      status: 400
    });
  }
}
