'use client';

import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Card } from '@/components/ui/card';
import {
  RegistrationInput,
  RegistrationSchemas
} from '@/schemas/registration-schema';
import {
  CategoryResponse,
  getCategories,
  Subcategories
} from '@/actions/category';
import { CustomSelect } from '@/components/custom-select';
import { getProvinces } from '@/actions/provinces';
import { getRegencies } from '@/actions/regencies';
import { getDistricts } from '@/actions/districts';
import { getVillages } from '@/actions/villages';
import { createRegistration } from '@/actions/registration-action';
import { getRegions } from '@/actions/region-action';
import { useRouter } from 'next/navigation';

export function generateRandomNumber(length: number = 8): string {
  const timestamp = Date.now().toString().slice(-5);
  const randomDigits = Math.floor(10000 + Math.random() * 90000).toString();
  return `${timestamp}${randomDigits}`.slice(0, length);
}

const RegistrationForm = () => {
  const form = useForm<RegistrationInput>({
    resolver: zodResolver(RegistrationSchemas),
    defaultValues: {
      noRegistration: generateRandomNumber(),
      fullName: '',
      nik: '',
      birthPlace: '',
      birthDate: '',
      categoryId: undefined,
      subCategoryId: undefined,
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

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [subCategories, setSubCategories] = useState<Subcategories[]>([]);

  const [provinces, setProvinces] = useState<{ id: number; name: string }[]>(
    []
  );
  const [regencies, setRegencies] = useState<{ id: number; name: string }[]>(
    []
  );
  const [districts, setDistricts] = useState<{ id: number; name: string }[]>(
    []
  );
  const [villages, setVillages] = useState<
    { id: number; name: string; postalCode: string }[]
  >([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number>(NaN);
  const [selectedRegencyId, setSelectedRegencyId] = useState<number>(NaN);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number>(NaN);

  const [kkPreview, setKkPreview] = useState<string | null>(null);
  const [ijazahPreview, setIjazahPreview] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [regions, setRegions] = useState<{ id: string; name: string }[]>([]);

  const router = useRouter();

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const fetchRegions = async () => {
    const data = await getRegions();
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
    if (selectedProvinceId) {
      fetchRegencies();
    }
  }, [selectedProvinceId, fetchRegencies]);

  useEffect(() => {
    if (selectedRegencyId) {
      fetchDistricts();
    }
  }, [selectedRegencyId, fetchDistricts]);

  useEffect(() => {
    if (selectedDistrictId) {
      fetchVillages();
    }
  }, [selectedDistrictId, fetchVillages]);

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

  const onSubmit = async (data: RegistrationInput) => {
    try {
      const result = await createRegistration(data);
      if (result.success) {
        toast.success(result.message);
        // @ts-ignore
        router.push(`/registration/success/${result.id}`);
      } else {
        // @ts-ignore
        toast.error(result.error.message);
      }
    } catch (error) {
      toast.error(JSON.stringify(error));
    }
  };

  return (
    <Card className='mx-auto max-w-4xl p-8'>
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
                    <Input {...field} placeholder='Masukkan 16 digit NIK' />
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
          {/* Bagian Kategori Perlombaan */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='categoryId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Kategori
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(Number(value));
                      form.setValue('subCategoryId', NaN);
                      const selectedCategory = categories.find(
                        (cat) => cat.id.toString() === value
                      );

                      setSubCategories(selectedCategory?.subcategories || []);
                    }}
                    value={field.value ? field.value.toString() : ''}
                    disabled={categories.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Pilih kategori' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()} // Konversi ke string
                        >
                          {category.name}
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
              name='subCategoryId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Jenjang
                  </FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={field.value ? field.value.toString() : ''}
                    disabled={!form.watch('categoryId')}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Pilih jenjang' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subCategories.map((subCat) => (
                        <SelectItem
                          key={subCat.id}
                          value={subCat.id.toString()}
                        >
                          {subCat.name}
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
                />
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
                    Upload Ijazah
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
