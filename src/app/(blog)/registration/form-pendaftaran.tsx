'use client';

import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import {
  RegistrationInput,
  RegistrationSchemas
} from '@/schemas/registration-schema';
import {
  getKelas,
  getSubKelasByKelasId,
  KelasResponse
} from '@/actions/category';
import { CustomSelect } from '@/components/custom-select';
import { getProvinces } from '@/actions/provinces';
import { getRegencies } from '@/actions/regencies';
import { getDistricts } from '@/actions/districts';
import { getVillages } from '@/actions/villages';
import { createRegistration } from '@/actions/registration-action';
import { getRegionsWithoutPusat } from '@/actions/region-action';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function generateRandomNumber(length: number = 8): string {
  const timestamp = Date.now().toString().slice(-5);
  const randomDigits = Math.floor(10000 + Math.random() * 90000).toString();
  return `${timestamp}${randomDigits}`.slice(0, length);
}

const formatInternationalNumber = (number: any) => {
  const numStr = number.toString();
  if (numStr.startsWith('62')) {
    return `+62 ${numStr.slice(2, 5)} ${numStr.slice(5, 9)} ${numStr.slice(9)}`;
  } else if (numStr.startsWith('96')) {
    return `+96 ${numStr.slice(2, 5)} ${numStr.slice(5, 9)} ${numStr.slice(9)}`;
  }
  return numStr;
};

const RegistrationForm = () => {
  const form = useForm<RegistrationInput>({
    resolver: zodResolver(RegistrationSchemas),
    defaultValues: {
      noRegistration: generateRandomNumber(),
      fullName: '',
      nik: '',
      birthPlace: '',
      birthDate: '',
      kelasId: '',
      subKelasId: '',
      institutionName: '',
      institutionAddress: '',
      regionId: '',
      provinceId: undefined,
      regencyId: undefined,
      districtId: undefined,
      villageId: undefined,
      postalCode: '',
      address: '',
      fatherName: '',
      motherName: '',
      parentPhone: ''
    }
  });

  const [kelas, setKelas] = useState<KelasResponse[]>([]);
  const [subKelas, setSubKelas] = useState<KelasResponse[]>([]);
  const [selectedKelas, setSelectedKelas] = useState<KelasResponse | null>();

  const [provinces, setProvinces] = useState<{ id: number; name: string }[]>(
    []
  );
  const [regencies, setRegencies] = useState<{ id: number; name: string }[]>(
    []
  );
  const [districts, setDistricts] = useState<{ id: number; name: string }[]>(
    []
  );

  const [regionSelected, setRegionSelected] = useState<any>(null);
  const [villages, setVillages] = useState<
    { id: number; name: string; postalCode: string }[]
  >([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number>(NaN);
  const [selectedRegencyId, setSelectedRegencyId] = useState<number>(NaN);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number>(NaN);

  const [skPreview, setSkPreview] = useState<string | null>(null);
  const [kkPreview, setKkPreview] = useState<string | null>(null);
  const [ijazahPreview, setIjazahPreview] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [regions, setRegions] = useState<{ id: string; name: string }[]>([]);

  const router = useRouter();

  const fetchCategories = async () => {
    const data = await getKelas();
    setKelas(data);
  };

  const fetchSubKelas = useCallback(async () => {
    if (selectedKelas) {
      const data = await getSubKelasByKelasId(selectedKelas.id);
      setSubKelas(data);
    }
  }, [selectedKelas]);

  const fetchRegions = async () => {
    const data = await getRegionsWithoutPusat();
    setRegions(data);
  };

  // Fetch Provinces
  const fetchProvinces = useCallback(async () => {
    try {
      const result = await getProvinces();
      setProvinces(result);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  }, []);

  // Fetch Regencies
  const fetchRegencies = useCallback(async () => {
    if (selectedProvinceId) {
      try {
        const result = await getRegencies(selectedProvinceId);
        // @ts-ignore
        setRegencies(result);
      } catch (error) {
        console.error('Error fetching regencies:', error);
      }
    }
  }, [selectedProvinceId]);

  // Fetch Districts
  const fetchDistricts = useCallback(async () => {
    if (selectedRegencyId) {
      try {
        const result = await getDistricts(selectedRegencyId);
        setDistricts(result);
      } catch (error) {
        toast.error('Error fetching districts:');
      }
    }
  }, [selectedRegencyId]);

  // Fetch Villages
  const fetchVillages = useCallback(async () => {
    if (selectedDistrictId) {
      try {
        const result = await getVillages(selectedDistrictId);
        setVillages(result);
      } catch (error) {
        console.error('Error fetching villages:', error);
      }
    }
  }, [selectedDistrictId]);

  useEffect(() => {
    fetchCategories();
    fetchRegions();
  }, []);

  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  useEffect(() => {
    fetchRegencies();
  }, [fetchRegencies]);

  useEffect(() => {
    fetchDistricts();
  }, [fetchDistricts]);

  useEffect(() => {
    fetchVillages();
  }, [fetchVillages]);

  useEffect(() => {
    fetchSubKelas();
  }, [fetchSubKelas]);

  const handleProvinceChange = (provinceId: number) => {
    setSelectedProvinceId(provinceId);
    form.setValue('regencyId', NaN);
    form.setValue('districtId', NaN);
    form.setValue('villageId', NaN);
    setRegencies([]);
    setDistricts([]);
    setVillages([]);
  };

  // Handler untuk perubahan Regency
  const handleRegencyChange = (regencyId: number) => {
    setSelectedRegencyId(regencyId);
    form.setValue('districtId', NaN); // Reset field district di form
    form.setValue('villageId', NaN); // Reset field village di form
    setDistricts([]); // Reset data districts
    setVillages([]); // Reset data villages
  };

  // Handler untuk perubahan District
  const handleDistrictChange = (districtId: number) => {
    setSelectedDistrictId(districtId);
    form.setValue('villageId', NaN); // Reset field village di form
    setVillages([]); // Reset data villages
  };

  // Handler untuk perubahan Village
  const handleVillageChange = (data: any) => {
    form.setValue('postalCode', data.postalCode);
    // setSelectedVillageId(villageId); // Jika ada state untuk village ID
    // Tidak perlu reset apa pun karena ini level terakhir
  };

  const createFormDataFromRegistrationInput = (
    data: RegistrationInput
  ): FormData => {
    const formData = new FormData();

    // Append semua field teks
    formData.append('noRegistration', data.noRegistration);
    formData.append('fullName', data.fullName);
    formData.append('nik', data.nik);
    formData.append('birthPlace', data.birthPlace);
    formData.append('birthDate', data.birthDate);
    formData.append('gender', data.gender); // pastikan ini string
    formData.append('kelasId', data.kelasId);
    formData.append('subKelasId', data.subKelasId);
    formData.append('institutionName', data.institutionName);
    formData.append('institutionAddress', data.institutionAddress);
    formData.append('regionId', data.regionId);
    formData.append('provinceId', String(data.provinceId));
    formData.append('regencyId', String(data.regencyId));
    formData.append('districtId', String(data.districtId));
    formData.append('villageId', String(data.villageId));
    formData.append('postalCode', data.postalCode);
    formData.append('address', data.address);
    formData.append('fatherName', data.fatherName);
    formData.append('motherName', data.motherName);
    formData.append('parentPhone', data.parentPhone);

    // Append file fields (File harus sudah instance of File)
    if (data.kk) formData.append('kk', data.kk);
    if (data.sk) formData.append('sk', data.sk);
    if (data.ijazah) formData.append('ijazah', data.ijazah);
    if (data.photo) formData.append('photo', data.photo);

    return formData;
  };

  const onSubmit = async (data: RegistrationInput) => {
    try {
      const formData = createFormDataFromRegistrationInput(data);

      const result: any = await axios.post('/api/registration', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      //   const result = await createRegistration(data);
      if (result?.data?.success) {
        // toast.success(result.message);
        // @ts-ignore
        router.push(`/registration/success/${result?.data?.id}`);
      } else {
        // @ts-ignore
        toast.error(result?.data?.error.message);
      }
    } catch (error) {
      console.log(error);
      // @ts-ignore
      toast.error(JSON.stringify(error?.response?.data?.error.message));
    }
  };

  return (
    <Card className='mx-auto max-w-4xl p-8'>
      <h2 className='text-center text-3xl font-bold text-gray-800'>
        Formulir Pendaftaran
      </h2>
      <h2 className='mb-8 text-center text-3xl font-bold text-gray-800'>
        MQK Amtsilati se Nusantara
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {/* Bagian Identitas */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='noRegistration'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Nomor Pendaftaran
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled
                      className='bg-gray-100 text-gray-600'
                    />
                  </FormControl>
                  <FormDescription>
                    Nomor ini dihasilkan otomatis oleh sistem.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='fullName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Nama Lengkap
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Masukkan nama lengkap' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='nik'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    NIK
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Masukkan 16 digit NIK'
                      inputMode='numeric'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='birthPlace'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Tempat Lahir
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Masukkan tempat lahir' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='birthDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Tanggal Lahir
                  </FormLabel>
                  <FormControl>
                    <Input type='date' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='gender'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Jenis Kelamin
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Pilih jenis kelamin' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='PUTRA'>PUTRA</SelectItem>
                      <SelectItem value='PUTRI'>PUTRI</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Bagian Alamat Pribadi */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='provinceId'
              render={({ field }) => (
                <CustomSelect
                  field={field}
                  label='Provinsi'
                  placeholder='Pilih Provinsi'
                  data={provinces}
                  onSelect={handleProvinceChange}
                  disabled={!provinces.length}
                />
              )}
            />
            <FormField
              control={form.control}
              name='regencyId'
              render={({ field }) => (
                <CustomSelect
                  field={field}
                  label='Kota/Kabupaten'
                  placeholder='Pilih Kabupaten / kota'
                  data={regencies}
                  onSelect={handleRegencyChange}
                  disabled={!regencies.length}
                />
              )}
            />
            <FormField
              control={form.control}
              name='districtId'
              render={({ field }) => (
                <CustomSelect
                  field={field}
                  label='Kecamatan'
                  placeholder='Pilih Kecamatan'
                  data={districts}
                  onSelect={handleDistrictChange}
                  disabled={!districts.length}
                />
              )}
            />
            <FormField
              control={form.control}
              name='villageId'
              render={({ field }) => (
                <CustomSelect
                  field={field}
                  label='Desa/Kelurahan'
                  placeholder='Pilih Desa/Kelurahan'
                  data={villages}
                  //   onSelect={handleVillageChange}
                  onSelectedObject={handleVillageChange}
                  disabled={!villages.length}
                />
              )}
            />

            <FormField
              control={form.control}
              name='postalCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Kode Pos
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Masukkan kode pos (5 digit)'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem className='md:col-span-2'>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Alamat Lengkap Pribadi
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='Masukkan alamat lengkap (jalan, nomor rumah, RT/RW, dll)'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Bagian Informasi Orang Tua */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='fatherName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Nama Ayah
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Masukkan nama ayah' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='motherName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Nama Ibu
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Masukkan nama ibu' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='parentPhone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Nomor Telepon Orang Tua
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Masukkan nomor telepon (contoh: 08123456789)'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Bagian Kategori Perlombaan */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='kelasId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Kategori
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue('subKelasId', '');
                      const selectedKelas = kelas.find(
                        (cat) => cat.id === value
                      );
                      setSubKelas([]);
                      setSelectedKelas(selectedKelas);
                    }}
                    value={field.value}
                    disabled={kelas.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Pilih kategori' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {kelas.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='subKelasId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Jenjang
                  </FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(val)}
                    value={field.value}
                    disabled={subKelas.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Pilih jenjang' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subKelas.map((subKel) => (
                        <SelectItem key={subKel.id} value={subKel.id}>
                          {subKel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Bagian Informasi Lembaga */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='institutionName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Nama Lembaga
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Masukkan nama lembaga' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormField
                control={form.control}
                name='regionId'
                render={({ field }) => (
                  <CustomSelect
                    field={field}
                    label='dibawah naungan korwil'
                    placeholder='Pilih korwil'
                    data={regions}
                    disabled={!regions.length}
                    onSelectedObject={(value) => {
                      setRegionSelected(value);
                    }}
                  />
                )}
              />
              {regionSelected && (
                <Card className='mt-2 p-4'>
                  <div className='grid grid-cols-3 gap-x-2'>
                    <div className=''>Korwil</div>
                    <div className='col-span-2'>: {regionSelected.name}</div>

                    <div className=''>Nama</div>
                    <div className='col-span-2'>
                      : {regionSelected.coordinator}
                    </div>

                    <div className=''>No Telp</div>
                    <Link
                      href={`https://wa.me/${regionSelected.phone}`}
                      target='_blank'
                      className='col-span-2'
                    >
                      : {formatInternationalNumber(regionSelected.phone)}
                    </Link>

                    <div className=''>Area</div>
                    <div className='col-span-2 break-words'>
                      : {regionSelected?.coverage.join(', ') || '-'}
                    </div>
                  </div>
                </Card>
              )}
            </div>

            <FormField
              control={form.control}
              name='institutionAddress'
              render={({ field }) => (
                <FormItem className='md:col-span-2'>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Alamat Lengkap Lembaga
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='Masukkan alamat lengkap lembaga'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Bagian Upload Dokumen */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='sk'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Upload SK Menetap dipondok
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='file'
                      accept='.jpg,.jpeg,.png'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                        if (file && file.type.startsWith('image/')) {
                          setSkPreview(URL.createObjectURL(file));
                        } else {
                          setSkPreview(null); // Reset preview jika bukan gambar
                        }
                      }}
                      //   className='border-gray-300 focus:border-blue-500'
                    />
                  </FormControl>
                  {skPreview && (
                    <div className='mt-2'>
                      <img
                        src={skPreview}
                        alt='Preview Ijazah'
                        className='h-32 w-auto rounded-md object-cover'
                      />
                    </div>
                  )}
                  <FormDescription>
                    File maksimum 2MB (JPG, PNG).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='kk'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Upload Kartu Keluarga (KK)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='file'
                      accept='.jpg,.jpeg,.png'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                        if (file && file.type.startsWith('image/')) {
                          setKkPreview(URL.createObjectURL(file));
                        } else {
                          setKkPreview(null); // Reset preview jika bukan gambar
                        }
                      }}
                      //   className='border-gray-300 focus:border-blue-500'
                    />
                  </FormControl>
                  {kkPreview && (
                    <div className='mt-2'>
                      <img
                        src={kkPreview}
                        alt='Preview Kartu Keluarga'
                        className='h-32 w-auto rounded-md object-cover'
                      />
                    </div>
                  )}
                  <FormDescription>
                    File maksimum 2MB (JPG, PNG).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='ijazah'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Upload Ijazah Terakhir
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='file'
                      accept='.jpg,.jpeg,.png'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                        if (file && file.type.startsWith('image/')) {
                          setIjazahPreview(URL.createObjectURL(file));
                        } else {
                          setIjazahPreview(null); // Reset preview jika bukan gambar
                        }
                      }}
                      //   className='border-gray-300 focus:border-blue-500'
                    />
                  </FormControl>
                  {ijazahPreview && (
                    <div className='mt-2'>
                      <img
                        src={ijazahPreview}
                        alt='Preview Ijazah'
                        className='h-32 w-auto rounded-md object-cover'
                      />
                    </div>
                  )}
                  <FormDescription>
                    File maksimum 2MB (JPG, PNG).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='photo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Upload Pas Foto 3x4
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='file'
                      accept='.jpg,.jpeg,.png'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                        if (file) {
                          setPhotoPreview(URL.createObjectURL(file));
                        } else {
                          setPhotoPreview(null); // Reset preview jika tidak ada file
                        }
                      }}
                      //   className='border-gray-300 focus:border-blue-500'
                    />
                  </FormControl>
                  {photoPreview && (
                    <div className='mt-2'>
                      <img
                        src={photoPreview}
                        alt='Preview Pas Foto'
                        className='h-32 w-auto rounded-md object-cover'
                      />
                    </div>
                  )}
                  <FormDescription>
                    File maksimum 2MB (JPG atau PNG).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Tombol Submit */}
          <div className='flex justify-end'>
            <Button disabled={form.formState.isSubmitting} type='submit'>
              {' '}
              {form.formState.isSubmitting ? 'Loading...' : 'Submit'}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default RegistrationForm;
