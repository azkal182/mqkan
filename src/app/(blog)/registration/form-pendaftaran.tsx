'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

export function generateRandomNumber(length: number = 8): string {
  const timestamp = Date.now().toString().slice(-5);
  const randomDigits = Math.floor(10000 + Math.random() * 90000).toString();
  return `${timestamp}${randomDigits}`.slice(0, length);
}

// Tipe data untuk wilayah
interface Region {
  id: string;
  name: string;
}

// Definisi tipe untuk objek dengan index signature
interface CityMap {
  [key: string]: Region[];
}
interface DistrictMap {
  [key: string]: Region[];
}
interface VillageMap {
  [key: string]: Region[];
}

// Dummy Data untuk Wilayah
const provinces: Region[] = [
  { id: '1', name: 'Jawa Barat' },
  { id: '2', name: 'Jawa Tengah' }
];
const cities: CityMap = {
  '1': [
    { id: '11', name: 'Bandung' },
    { id: '12', name: 'Bekasi' }
  ],
  '2': [{ id: '21', name: 'Semarang' }]
};
const districts: DistrictMap = {
  '11': [{ id: '111', name: 'Cimahi' }],
  '12': [{ id: '121', name: 'Tambun' }],
  '21': [{ id: '211', name: 'Tembalang' }]
};
const villages: VillageMap = {
  '111': [{ id: '1111', name: 'Cimahi Utara' }],
  '121': [{ id: '1211', name: 'Tambun Selatan' }],
  '211': [{ id: '2111', name: 'Tembalang Barat' }]
};

// Skema Validasi dengan Zod
const formSchema = z.object({
  noPendaftaran: z.string().min(1),
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  nik: z.string().min(16, 'NIK harus 16 digit').max(16, 'NIK harus 16 digit'),
  birthPlace: z.string().min(3, 'Tempat lahir minimal 3 karakter'),
  birthDate: z.string().min(1, 'Tanggal lahir harus diisi'),
  gender: z.string().min(1, 'Jenis kelamin harus dipilih'),
  category: z.string().min(1, 'Kategori harus dipilih'),
  classLevel: z.string().min(1, 'Kelas harus dipilih'),
  institutionName: z.string().min(3, 'Nama lembaga minimal 3 karakter'), // Nama Lembaga
  institutionAddress: z.string().min(10, 'Alamat lembaga minimal 10 karakter'), // Alamat Lembaga
  korwil: z.string().min(3, 'Korwil minimal 3 karakter'), // Korwil
  province: z.string().min(1, 'Provinsi harus dipilih'),
  city: z.string().min(1, 'Kota/Kabupaten harus dipilih'),
  district: z.string().min(1, 'Kecamatan harus dipilih'),
  village: z.string().min(1, 'Desa/Kelurahan harus dipilih'),
  postalCode: z
    .string()
    .min(5, 'Kode pos harus 5 digit')
    .max(5, 'Kode pos harus 5 digit'),
  address: z.string().min(10, 'Alamat minimal 10 karakter'),
  fatherName: z.string().min(3, 'Nama ayah minimal 3 karakter'), // Nama Ayah
  motherName: z.string().min(3, 'Nama ibu minimal 3 karakter'), // Nama Ibu
  parentPhone: z
    .string()
    .min(10, 'Nomor telepon minimal 10 digit')
    .max(15, 'Nomor telepon maksimal 15 digit'), // Nomor Telepon Orang Tua
  kk: z
    .instanceof(File)
    .refine((file) => file?.size <= 5 * 1024 * 1024, 'File maksimum 5MB')
    .refine(
      (file) =>
        ['image/jpeg', 'image/png', 'application/pdf'].includes(file?.type),
      'File harus berupa JPG, PNG, atau PDF'
    ),
  ijazah: z
    .instanceof(File)
    .refine((file) => file?.size <= 5 * 1024 * 1024, 'File maksimum 5MB')
    .refine(
      (file) =>
        ['image/jpeg', 'image/png', 'application/pdf'].includes(file?.type),
      'File harus berupa JPG, PNG, atau PDF'
    ),
  photo: z
    .instanceof(File)
    .refine((file) => file?.size <= 2 * 1024 * 1024, 'File maksimum 2MB') // Pas Foto 3x4
    .refine(
      (file) => ['image/jpeg', 'image/png'].includes(file?.type),
      'File harus berupa JPG atau PNG'
    )
});

const RegistrationForm = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      noPendaftaran: generateRandomNumber(),
      name: '',
      nik: '',
      birthPlace: '',
      birthDate: '',
      gender: '',
      category: '',
      classLevel: '',
      institutionName: '',
      institutionAddress: '',
      korwil: '',
      province: '',
      city: '',
      district: '',
      village: '',
      postalCode: '',
      address: '',
      fatherName: '',
      motherName: '',
      parentPhone: '',
      kk: null,
      ijazah: null,
      photo: null
    }
  });

  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const [kkPreview, setKkPreview] = useState<string | null>(null);
  const [ijazahPreview, setIjazahPreview] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const onSubmit = (data: any) => {
    console.log('Form Data:', data);
    toast.success('Pendaftaran berhasil dikirim!');
  };

  return (
    <div className='mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-lg'>
      <h2 className='text-center text-3xl font-bold text-gray-800'>
        Formulir Pendaftaran
      </h2>
      <h2 className='mb-8 text-center text-3xl font-bold text-gray-800'>
        MQK Amtsilati Nusantara
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {/* Bagian Identitas */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='noPendaftaran'
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
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Nama Lengkap
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Masukkan nama lengkap'
                      className='border-gray-300 focus:border-blue-500'
                    />
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
                      className='border-gray-300 focus:border-blue-500'
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
                    <Input
                      {...field}
                      placeholder='Masukkan tempat lahir'
                      className='border-gray-300 focus:border-blue-500'
                    />
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
                    <Input
                      type='date'
                      {...field}
                      className='border-gray-300 focus:border-blue-500'
                    />
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
                      <SelectTrigger className='border-gray-300 focus:border-blue-500'>
                        <SelectValue placeholder='Pilih jenis kelamin' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='01'>PUTRA</SelectItem>
                      <SelectItem value='02'>PUTRI</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Bagian Kategori Perlombaan */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Kategori
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='border-gray-300 focus:border-blue-500'>
                        <SelectValue placeholder='Pilih kategori' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='01'>OLIMPIADE AMTSILATI</SelectItem>
                      <SelectItem value='02'>MQK</SelectItem>
                      <SelectItem value='03'>DAKWAH</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='classLevel'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    JENJANG
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='border-gray-300 focus:border-blue-500'>
                        <SelectValue placeholder='Pilih JENJANG' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='01'>ULA</SelectItem>
                      <SelectItem value='02'>WUSTHO</SelectItem>
                      <SelectItem value='03'>ULYA</SelectItem>
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
                    <Input
                      {...field}
                      placeholder='Masukkan nama lembaga'
                      className='border-gray-300 focus:border-blue-500'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='korwil'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Di Bawah Naungan Korwil
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='border-gray-300 focus:border-blue-500'>
                          <SelectValue placeholder='Pilih Nama Korwil' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='01'>JATENG 1</SelectItem>
                        <SelectItem value='02'>JATENG 2</SelectItem>
                        <SelectItem value='03'>JATIM 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      className='border-gray-300 focus:border-blue-500'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Bagian Alamat Pribadi */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='province'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Provinsi
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedProvince(value);
                      form.setValue('city', '');
                      form.setValue('district', '');
                      form.setValue('village', '');
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className='border-gray-300 focus:border-blue-500'>
                        <SelectValue placeholder='Pilih provinsi' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {provinces.map((prov) => (
                        <SelectItem key={prov.id} value={prov.id}>
                          {prov.name}
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
              name='city'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Kota/Kabupaten
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedCity(value);
                      form.setValue('district', '');
                      form.setValue('village', '');
                    }}
                    disabled={!selectedProvince}
                  >
                    <FormControl>
                      <SelectTrigger className='border-gray-300 focus:border-blue-500'>
                        <SelectValue placeholder='Pilih kota/kabupaten' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedProvince &&
                        cities[selectedProvince]?.map((city) => (
                          <SelectItem key={city.id} value={city.id}>
                            {city.name}
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
              name='district'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Kecamatan
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedDistrict(value);
                      form.setValue('village', '');
                    }}
                    disabled={!selectedCity}
                  >
                    <FormControl>
                      <SelectTrigger className='border-gray-300 focus:border-blue-500'>
                        <SelectValue placeholder='Pilih kecamatan' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedCity &&
                        districts[selectedCity]?.map((district) => (
                          <SelectItem key={district.id} value={district.id}>
                            {district.name}
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
              name='village'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Desa/Kelurahan
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    disabled={!selectedDistrict}
                  >
                    <FormControl>
                      <SelectTrigger className='border-gray-300 focus:border-blue-500'>
                        <SelectValue placeholder='Pilih desa/kelurahan' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedDistrict &&
                        villages[selectedDistrict]?.map((village) => (
                          <SelectItem key={village.id} value={village.id}>
                            {village.name}
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
                      className='border-gray-300 focus:border-blue-500'
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
                      className='border-gray-300 focus:border-blue-500'
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
                    <Input
                      {...field}
                      placeholder='Masukkan nama ayah'
                      className='border-gray-300 focus:border-blue-500'
                    />
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
                    <Input
                      {...field}
                      placeholder='Masukkan nama ibu'
                      className='border-gray-300 focus:border-blue-500'
                    />
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
                      className='border-gray-300 focus:border-blue-500'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Bagian Upload Dokumen */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
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
                      accept='.jpg,.jpeg,.png,.pdf'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                        if (file && file.type.startsWith('image/')) {
                          setKkPreview(URL.createObjectURL(file));
                        } else {
                          setKkPreview(null); // Reset preview jika bukan gambar
                        }
                      }}
                      className='border-gray-300 focus:border-blue-500'
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
                    File maksimum 5MB (JPG, PNG, atau PDF).
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
                    Upload Ijazah
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='file'
                      accept='.jpg,.jpeg,.png,.pdf'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                        if (file && file.type.startsWith('image/')) {
                          setIjazahPreview(URL.createObjectURL(file));
                        } else {
                          setIjazahPreview(null); // Reset preview jika bukan gambar
                        }
                      }}
                      className='border-gray-300 focus:border-blue-500'
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
                    File maksimum 5MB (JPG, PNG, atau PDF).
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
                      className='border-gray-300 focus:border-blue-500'
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
            <Button type='submit'>Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;
