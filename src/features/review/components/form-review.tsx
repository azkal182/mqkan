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
  RegistrationUpdateSchema,
  RegistrationUpdateSchemaInput
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
import { getRegionsWithoutPusat } from '@/actions/region-action';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import ConfirmValidationDialog from '@/components/confirm-validation-dialog';
import { DateTime } from 'luxon';
import { XIcon } from 'lucide-react';

// Utility function to format phone numbers
const formatInternationalNumber = (number: any) => {
  const numStr = number.toString();
  if (numStr.startsWith('62')) {
    return `+62 ${numStr.slice(2, 5)} ${numStr.slice(5, 9)} ${numStr.slice(9)}`;
  } else if (numStr.startsWith('96')) {
    return `+96 ${numStr.slice(2, 5)} ${numStr.slice(5, 9)} ${numStr.slice(9)}`;
  }
  return numStr;
};

// Utility function to format ISO date to YYYY-MM-DD
// const formatDateForInput = (isoDate: string | undefined) => {
//   if (!isoDate) return '';
//   return isoDate.split('T')[0]; // Extract YYYY-MM-DD
// };

// Define the props interface
// function formatDateForInput(date: unknown): string {
//     const parsedDate = new Date(date as string);
//     return isNaN(parsedDate.getTime()) ? '' : parsedDate.toISOString().slice(0, 10);
//   }
function formatDateForInput(date: string | Date | null | undefined): string {
  if (!date) return '';

  const dt =
    date instanceof Date
      ? DateTime.fromJSDate(date).setZone('Asia/Jakarta')
      : DateTime.fromISO(String(date), { zone: 'utc' }).setZone('Asia/Jakarta');

  return dt.isValid ? dt.toFormat('yyyy-MM-dd') : '';
}

interface ReviewFormProps {
  data?: Partial<RegistrationUpdateSchemaInput> & {
    skUrl?: string;
    kkUrl?: string;
    ijazahUrl?: string;
    photoUrl?: string;
  }; // Extend to include file URLs
}

const ReviewForm = ({ data }: ReviewFormProps) => {
  const form = useForm<RegistrationUpdateSchemaInput>({
    resolver: zodResolver(RegistrationUpdateSchema),
    defaultValues: {
      id: data?.id,
      fullName: data?.fullName || '',
      nik: data?.nik || '',
      birthPlace: data?.birthPlace || '',
      birthDate: formatDateForInput(data?.birthDate) || '',
      kelasId: data?.kelasId || '',
      subKelasId: data?.subKelasId || '',
      institutionName: data?.institutionName || '',
      institutionAddress: data?.institutionAddress || '',
      regionId: data?.regionId || '',
      provinceId: data?.provinceId || undefined,
      regencyId: data?.regencyId || undefined,
      districtId: data?.districtId || undefined,
      villageId: data?.villageId || undefined,
      postalCode: data?.postalCode || '',
      address: data?.address || '',
      fatherName: data?.fatherName || '',
      motherName: data?.motherName || '',
      parentPhone: data?.parentPhone || '',
      gender: data?.gender || 'PUTRA'
    }
  });
  const [kelas, setKelas] = useState<KelasResponse[]>([]);
  const [subKelas, setSubKelas] = useState<KelasResponse[]>([]);
  const [selectedKelas, setSelectedKelas] = useState<KelasResponse | null>(
    null
  );

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
  const [selectedProvinceId, setSelectedProvinceId] = useState<number>(
    data?.provinceId || NaN
  );
  const [selectedRegencyId, setSelectedRegencyId] = useState<number>(
    data?.regencyId || NaN
  );
  const [selectedDistrictId, setSelectedDistrictId] = useState<number>(
    data?.districtId || NaN
  );

  const [skPreview, setSkPreview] = useState<string | null>(
    data?.skUrl || null
  );
  const [kkPreview, setKkPreview] = useState<string | null>(
    data?.kkUrl || null
  );
  const [ijazahPreview, setIjazahPreview] = useState<string | null>(
    data?.ijazahUrl || null
  );
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    data?.photoUrl || null
  );

  const [regions, setRegions] = useState<{ id: string; name: string }[]>([]);
  const [regionSelected, setRegionSelected] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [rotation, setRotation] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const router = useRouter();

  // Fetch data functions
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

  const fetchProvinces = useCallback(async () => {
    try {
      const result = await getProvinces();
      setProvinces(result);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  }, []);

  const fetchRegencies = useCallback(async () => {
    if (selectedProvinceId && !isNaN(selectedProvinceId)) {
      try {
        const result = await getRegencies(selectedProvinceId);
        // @ts-ignore
        setRegencies(result);
      } catch (error) {
        console.error('Error fetching regencies:', error);
      }
    }
  }, [selectedProvinceId]);

  const fetchDistricts = useCallback(async () => {
    if (selectedRegencyId && !isNaN(selectedRegencyId)) {
      try {
        const result = await getDistricts(selectedRegencyId);
        setDistricts(result);
      } catch (error) {
        toast.error('Error fetching districts:');
      }
    }
  }, [selectedRegencyId]);

  const fetchVillages = useCallback(async () => {
    if (selectedDistrictId && !isNaN(selectedDistrictId)) {
      try {
        const result = await getVillages(selectedDistrictId);
        setVillages(result);
      } catch (error) {
        console.error('Error fetching villages:', error);
      }
    }
  }, [selectedDistrictId]);

  // Initialize form with provided data
  useEffect(() => {
    if (data) {
      console.log(JSON.stringify(data, null, 2));

      // Set initial values for dependent fields
      if (data.provinceId && !isNaN(data.provinceId)) {
        setSelectedProvinceId(data.provinceId);
      }
      if (data.regencyId && !isNaN(data.regencyId)) {
        setSelectedRegencyId(data.regencyId);
      }
      if (data.districtId && !isNaN(data.districtId)) {
        setSelectedDistrictId(data.districtId);
      }
      if (data.kelasId) {
        const selected = kelas.find((cat) => cat.id === data.kelasId);
        setSelectedKelas(selected || null);
      }
      if (data.subKelasId) {
        // const selected = kelas.find((cat) => cat.id === data.kelasId);
        // setSelectedKelas(selected || null);
      }
      if (data.regionId) {
        const selectedRegion = regions.find((reg) => reg.id === data.regionId);
        setRegionSelected(selectedRegion || null);
      }
    }
  }, [data, kelas, regions]);

  // Fetch initial data
  useEffect(() => {
    fetchCategories();
    fetchRegions();
    fetchProvinces();
  }, [fetchProvinces]);

  // Fetch dependent data when IDs change
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

  // Handlers for location changes
  const handleProvinceChange = (provinceId: number) => {
    setSelectedProvinceId(provinceId);
    form.setValue('regencyId', NaN);
    form.setValue('districtId', NaN);
    form.setValue('villageId', NaN);
    setRegencies([]);
    setDistricts([]);
    setVillages([]);
  };

  const handleRegencyChange = (regencyId: number) => {
    setSelectedRegencyId(regencyId);
    form.setValue('districtId', NaN);
    form.setValue('villageId', NaN);
    setDistricts([]);
    setVillages([]);
  };

  const handleDistrictChange = (districtId: number) => {
    setSelectedDistrictId(districtId);
    form.setValue('villageId', NaN);
    setVillages([]);
  };

  const handleVillageChange = (data: any) => {
    form.setValue('postalCode', data.postalCode);
  };

  // Form data creation
  const createFormDataFromRegistrationInput = (
    data: RegistrationUpdateSchemaInput
  ): FormData => {
    const formData = new FormData();
    formData.append('id', data.id);
    formData.append('fullName', data.fullName);
    formData.append('nik', data.nik);
    formData.append('birthPlace', data.birthPlace);
    formData.append('birthDate', data.birthDate);
    formData.append('gender', data.gender);
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

    if (data.kk) formData.append('kk', data.kk);
    if (data.sk) formData.append('sk', data.sk);
    if (data.ijazah) formData.append('ijazah', data.ijazah);
    if (data.photo) formData.append('photo', data.photo);

    return formData;
  };

  // Form submission
  const onSubmit = async (data: RegistrationUpdateSchemaInput) => {
    try {
      // console.log(JSON.stringify(data,null,2))
      const formData = createFormDataFromRegistrationInput(data);
      const result: any = await axios.put('/api/peserta', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (result?.data?.success) {
        // router.push(`/dashboard/participants/review-korwil?participantId=${data?.id}`);
        toast.success('Update peserta berhasil');
        location.reload();
      } else {
        toast.error(result?.data?.error.message);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(JSON.stringify('kesalahan sistem'));
    }
  };

  const images = [
    { src: data?.ijazahUrl, alt: 'Ijazah' },
    { src: data?.kkUrl, alt: 'KK' },
    { src: data?.skUrl, alt: 'SK' },
    { src: data?.photoUrl, alt: 'Photo' }
  ];

  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleOpen = (img: any) => {
    setSelectedImage(img);
    setRotation(0);
    setZoomed(false);
  };

  const toggleZoom = () => setZoomed((z) => !z);

  //   console.log(form.formState.errors)

  return (
    <div className=''>
      <h2 className='text-center text-3xl font-bold text-gray-800'>
        Review Peserta
      </h2>
      <h2 className='mb-8 text-center text-3xl font-bold text-gray-800'>
        MQK Amtsilati se Nusantara
      </h2>
      <div className='divide flex flex-col items-start p-4 md:flex-row'>
        <div className='max-w-4xl'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {/* Bagian Identitas */}
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='fullName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-semibold text-gray-700'>
                        Nama Lengkap
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={!editMode}
                          {...field}
                          placeholder='Masukkan nama lengkap'
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
                          disabled={!editMode}
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
                        <Input
                          disabled={!editMode}
                          {...field}
                          placeholder='Masukkan tempat lahir'
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
                        <Input disabled={!editMode} type='date' {...field} />
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
                        disabled={!editMode}
                        onValueChange={field.onChange}
                        value={field.value}
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
                      disabled={!provinces.length || !editMode}
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
                      disabled={!regencies.length || !editMode}
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
                      disabled={!districts.length || !editMode}
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
                      onSelectedObject={handleVillageChange}
                      disabled={!villages.length || !editMode}
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
                          disabled={!editMode}
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
                          disabled={!editMode}
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
                        <Input
                          disabled={!editMode}
                          {...field}
                          placeholder='Masukkan nama ayah'
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
                          disabled={!editMode}
                          {...field}
                          placeholder='Masukkan nama ibu'
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
                          disabled={!editMode}
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
                          setSelectedKelas(selectedKelas || null);
                        }}
                        value={field.value}
                        disabled={kelas.length === 0 || !editMode}
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
                        disabled={subKelas.length === 0 || !editMode}
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
                        <Input
                          disabled={!editMode}
                          {...field}
                          placeholder='Masukkan nama lembaga'
                        />
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
                        disabled={!regions.length || !editMode}
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
                        <div className='col-span-2'>
                          : {regionSelected.name}
                        </div>
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
                          : {regionSelected?.coverage?.join(', ') || '-'}
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
                          disabled={!editMode}
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
                          disabled={!editMode}
                          type='file'
                          accept='.jpg,.jpeg,.png'
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            field.onChange(file);
                            if (file && file.type.startsWith('image/')) {
                              setSkPreview(URL.createObjectURL(file));
                            } else {
                              setSkPreview(data?.skUrl || null);
                            }
                          }}
                        />
                      </FormControl>
                      {skPreview && (
                        <div className='mt-2'>
                          <img
                            src={skPreview}
                            alt='Preview SK'
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
                          disabled={!editMode}
                          type='file'
                          accept='.jpg,.jpeg,.png'
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            field.onChange(file);
                            if (file && file.type.startsWith('image/')) {
                              setKkPreview(URL.createObjectURL(file));
                            } else {
                              setKkPreview(data?.kkUrl || null);
                            }
                          }}
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
                          disabled={!editMode}
                          type='file'
                          accept='.jpg,.jpeg,.png'
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            field.onChange(file);
                            if (file && file.type.startsWith('image/')) {
                              setIjazahPreview(URL.createObjectURL(file));
                            } else {
                              setIjazahPreview(data?.ijazahUrl || null);
                            }
                          }}
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
                          disabled={!editMode}
                          type='file'
                          accept='.jpg,.jpeg,.png'
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            field.onChange(file);
                            if (file && file.type.startsWith('image/')) {
                              setPhotoPreview(URL.createObjectURL(file));
                            } else {
                              setPhotoPreview(data?.photoUrl || null);
                            }
                          }}
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
                {editMode && (
                  <Button disabled={form.formState.isSubmitting} type='submit'>
                    {form.formState.isSubmitting ? 'Loading...' : 'Submit'}
                  </Button>
                )}
                {!editMode && (
                  <Button onClick={() => setEditMode(true)}>Edit</Button>
                )}
                {!editMode && (
                  <div className='ml-4'>
                    <ConfirmValidationDialog
                      pesertaId={data!.id!}
                      onSuccess={() => {
                        router.push(`/dashboard/participants`);
                      }}
                    />
                  </div>
                )}
              </div>
            </form>
          </Form>
        </div>
        <Separator orientation='vertical' />
        <div className='p-4'>
          {/* <div className='border p-2'>
            <Image src={data?.ijazahUrl||"" } alt='ijazah' width={500} height={700}/>
        </div>
        <div>
            <Image src={data?.kkUrl||"" } alt='kk' width={500} height={700}/>
        </div>
        <div>
            <Image src={data?.skUrl||"" } alt='sk' width={500} height={700}/>
        </div>
        <div>
            <Image src={data?.photoUrl||"" } alt='photo' width={500} height={700}/>
        </div> */}
          {/* {images.map(
        (img, idx) =>
          img.src && (
            <Dialog key={idx}>
              <DialogTrigger asChild>
                <div
                  className="border p-2 cursor-pointer hover:opacity-80 transition"
                  onClick={() => handleOpen(img)}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={500}
                    height={700}
                    className="object-cover"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] p-0 bg-black">
                <DialogTitle className="sr-only">{img.alt}</DialogTitle>

                <div className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
                  <div
                    className="relative cursor-zoom-in"
                    onClick={toggleZoom}
                    style={{
                      transform: `rotate(${rotation}deg) scale(${zoomed ? 2 : 1})`,
                      transition: 'transform 0.3s ease-in-out',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Image
                      src={selectedImage?.src || ''}
                      alt={selectedImage?.alt || ''}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 space-x-2">
                  <button
                    onClick={handleRotate}
                    className="bg-white px-4 py-2 text-sm font-medium rounded shadow hover:bg-gray-200"
                  >
                    🔄 Rotate
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          )
      )} */}

          {images.map(
            (img, idx) =>
              img.src && (
                <Dialog key={idx}>
                  <DialogTrigger asChild>
                    <div
                      className='msx-w-full cursor-pointer border p-2 transition hover:opacity-80'
                      onClick={() => handleOpen(img)}
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        width={500}
                        height={700}
                        className='max-w-full object-cover'
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent className='h-[90vh] w-full max-w-5xl overflow-hidden bg-black p-0'>
                    <DialogTitle className='sr-only'>{img.alt}</DialogTitle>
                    <DialogClose asChild>
                      <Button
                        className='0 absolute top-4 right-4 z-50'
                        size={'icon'}
                        variant={'secondary'}
                      >
                        <XIcon />
                      </Button>
                    </DialogClose>

                    <div
                      className={`h-full w-full ${
                        zoomed
                          ? 'overflow-auto'
                          : 'flex items-center justify-center'
                      }`}
                    >
                      <div
                        className={`relative ${
                          zoomed
                            ? 'min-h-[200%] min-w-[200%] cursor-zoom-out'
                            : 'h-full w-full cursor-zoom-in'
                        }`}
                        onClick={toggleZoom}
                        style={{
                          transform: `rotate(${rotation}deg) scale(${zoomed ? 1.5 : 1})`,
                          transition: 'transform 0.3s ease-in-out'
                        }}
                      >
                        {selectedImage?.src && (
                          <img
                            src={selectedImage.src}
                            alt={selectedImage.alt}
                            className='absolute inset-0 h-full w-full object-contain'
                          />
                        )}
                      </div>
                    </div>

                    <div className='absolute right-4 bottom-4 space-x-2'>
                      <button
                        onClick={handleRotate}
                        className='rounded bg-white px-4 py-2 text-sm font-medium shadow hover:bg-gray-200'
                      >
                        🔄 Rotate
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
