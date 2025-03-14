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
  category: z.string().min(1, 'Kategori  harus dipilih'), // Validasi kategori
  classLevel: z.string().min(1, 'Kelas harus dipilih'), // Validasi kelas
  province: z.string().min(1, 'Provinsi harus dipilih'),
  city: z.string().min(1, 'Kota/Kabupaten harus dipilih'),
  district: z.string().min(1, 'Kecamatan harus dipilih'),
  village: z.string().min(1, 'Desa/Kelurahan harus dipilih'),
  postalCode: z
    .string()
    .min(5, 'Kode pos harus 5 digit')
    .max(5, 'Kode pos harus 5 digit'),
  address: z.string().min(10, 'Alamat minimal 10 karakter'),
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
      category: '', // Default untuk kategori
      classLevel: '', // Default untuk kelas
      province: '',
      city: '',
      district: '',
      village: '',
      postalCode: '',
      address: '',
      kk: null,
      ijazah: null
    }
  });

  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

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
                      <SelectItem value='Laki-laki'>Laki-laki</SelectItem>
                      <SelectItem value='Perempuan'>Perempuan</SelectItem>
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
                      <SelectItem value='MQK'>MQK</SelectItem>
                      <SelectItem value='Olimpiade'>Olimpiade</SelectItem>
                      <SelectItem value='Dakwah'>Dakwah</SelectItem>
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
                    Kelas
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='border-gray-300 focus:border-blue-500'>
                        <SelectValue placeholder='Pilih kelas' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Ula'>Ula</SelectItem>
                      <SelectItem value='Ulya'>Ulya</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Bagian Alamat */}
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
                    Alamat Lengkap
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

          {/* Bagian Upload Dokumen */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
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
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      className='border-gray-300 focus:border-blue-500'
                    />
                  </FormControl>
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
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      className='border-gray-300 focus:border-blue-500'
                    />
                  </FormControl>
                  <FormDescription>
                    File maksimum 5MB (JPG, PNG, atau PDF).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Tombol Submit */}
          <div className='flex justify-end'>
            <Button
              type='submit'
              className='bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700'
            >
              Submit Pendaftaran
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;
