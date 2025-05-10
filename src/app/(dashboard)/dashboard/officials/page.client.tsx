'use client';
import { Official } from '@/actions/official-action';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Session } from 'next-auth';
import React, { useState } from 'react';
import { EditOfficialForm } from './edit-official-form';
import { AddOfficialForm } from './add-official-form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import Image from 'next/image';
import { DeleteOfficialDialog } from '@/components/delete-official-dialog';
import { useRouter } from 'next/navigation';

interface OfficialTableProps {
  data: Official[];
  regions: {
    name: string;
    id: string;
  }[];
}
const PageClient = ({ data, regions }: OfficialTableProps) => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Official | null>(null);
  const router = useRouter();
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              setEditData(null);
              setOpen(true);
            }}
          >
            Tambah
          </Button>
        </DialogTrigger>

        {/* Tombol edit */}
        {/* <Button onClick={() => { setEditData(item); setOpen(true); }}>Edit</Button> */}

        <DialogContent className='max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>
              {editData ? 'Edit Official' : 'Tambah Official'}
            </DialogTitle>
          </DialogHeader>

          {editData ? (
            <EditOfficialForm
              regions={regions}
              data={editData}
              onSuccess={() => setOpen(false)}
            />
          ) : (
            <AddOfficialForm
              regions={regions}
              onSuccess={() => setOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama Lengkap</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>No Telp</TableHead>
              <TableHead>Foto</TableHead>
              <TableHead>Korwil</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, i: number) => (
              <TableRow key={item.id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{item.fullName}</TableCell>
                <TableCell>{item.address}</TableCell>
                <TableCell>{item.phone}</TableCell>
                <TableCell>
                  {item.photo ? (
                    <img
                      src={item.photo}
                      alt='photo'
                      className='mx-auto h-auto max-w-14 rounded-md'
                    />
                  ) : (
                    <span className='text-gray-300'>No Pic</span>
                  )}
                </TableCell>
                <TableCell>
                  {regions.find((r) => r.id === item.regionId)?.name ?? '-'}
                </TableCell>
                <TableCell>
                  <div className='flex space-x-3'>
                    <Button
                      size={'sm'}
                      variant={'outline'}
                      onClick={() => {
                        setEditData(item);
                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    {/* <Button size={'sm'} variant={'destructive'}>
                      Delete
                    </Button> */}
                    <DeleteOfficialDialog
                      userId={item.id}
                      userName={item.fullName}
                      onDeleteSuccess={() => router.refresh()}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PageClient;
