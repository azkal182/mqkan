import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  OfficialFormDataEdit,
  officialSchemaEdit
} from '@/schemas/official-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Official } from '@/actions/official-action';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface EditOfficialFormProps {
  data: Official;
  onSuccess: () => void;
  regions: {
    name: string;
    id: string;
  }[];
}

export function EditOfficialForm({
  data,
  onSuccess,
  regions
}: EditOfficialFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    data?.photo || null
  );
  const router = useRouter();
  const form = useForm<OfficialFormDataEdit>({
    resolver: zodResolver(officialSchemaEdit),
    defaultValues: {
      id: data.id,
      fullName: data.fullName,
      address: data.address,
      phone: data.phone,
      aggree: data.aggree,
      regionId: data.regionId || undefined
    }
  });

  useEffect(() => {
    // Cleanup URL lama jika ada
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const createFormDataOfficialInput = (
    data: OfficialFormDataEdit
  ): FormData => {
    const formData = new FormData();

    // Append semua field teks
    // formData.append('noRegistration', data.noRegistration);
    formData.append('id', data.id);
    formData.append('fullName', data.fullName);
    formData.append('address', data.address);
    formData.append('phone', data.phone);
    formData.append('aggree', data.aggree.toString());
    formData.append('regionId', data.regionId);

    // Append file fields (File harus sudah instance of File)
    if (data.photo) formData.append('photo', data.photo);

    return formData;
  };

  const onSubmit = async (values: OfficialFormDataEdit) => {
    const formData = createFormDataOfficialInput(values);
    await axios.put('/api/official', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    onSuccess?.();
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='fullName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder='shadcn' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Input placeholder='xxx' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Telepon</FormLabel>
              <FormControl>
                <Input placeholder='08xxxxxx' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='regionId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Korwil</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Pilih Korwil' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.name}
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
          name='photo'
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Picture</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  placeholder='Picture'
                  type='file'
                  accept='image/*'
                  onChange={(event) => {
                    //   onChange(event.target.files && event.target.files[0])
                    const file = event.target.files && event.target.files[0];
                    onChange(file);
                    // Buat URL preview
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setPreviewUrl(url);
                    } else {
                      setPreviewUrl(data?.photo || null);
                    }
                  }}
                />
              </FormControl>
              {previewUrl && (
                <div className='mt-2'>
                  <img
                    src={previewUrl}
                    alt='Preview'
                    className='mx-auto h-auto max-w-28 rounded-md'
                  />
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='aggree'
          render={({ field }) => (
            <FormItem className='flex items-start space-x-2'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className='leading-4'>
                Sanggup bertanggung jawab sepenuhnya terkait peserta yang
                dikirimkan oleh delegasinya
              </FormLabel>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className=''
          disabled={form.watch('aggree') !== true}
          type='submit'
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
