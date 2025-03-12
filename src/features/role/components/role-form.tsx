// 'use client';

// import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Input } from '@/components/ui/input';
// import { useRouter } from 'next/navigation';
// import { createRole, updateRole } from '@/actions/role-action';
// import { getPermissions } from '@/actions/permission-action';

// export default function RoleForm({
//   role,
//   pageTitle
// }: {
//   role?: any;
//   pageTitle: string;
// }) {
//   const router = useRouter();
//   const [name, setName] = useState(role?.name || '');
//   const [permissions, setPermissions] = useState<
//     { id: string; name: string; label: string }[]
//   >([]);
//   const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
//     role?.permissionIds || []
//   );

//   useEffect(() => {
//     async function fetchPermissions() {
//       const perms = await getPermissions();
//       setPermissions(perms);
//     }
//     fetchPermissions();
//   }, []);

//   // 🔹 Group permissions berdasarkan label
//   const groupedPermissions = permissions.reduce(
//     (acc, perm) => {
//       if (!acc[perm.label]) acc[perm.label] = [];
//       acc[perm.label].push(perm);
//       return acc;
//     },
//     {} as Record<string, { id: string; name: string }[]>
//   );

//   // 🔹 Handle check/uncheck semua permission dalam satu grup
//   const toggleGroup = (label: string) => {
//     const allIds = groupedPermissions[label].map((perm) => perm.id);
//     const allChecked = allIds.every((id) => selectedPermissions.includes(id));

//     setSelectedPermissions(
//       (prev) =>
//         allChecked
//           ? prev.filter((id) => !allIds.includes(id)) // Uncheck semua jika sudah terpilih
//           : [...prev, ...allIds.filter((id) => !prev.includes(id))] // Check semua yang belum dipilih
//     );
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (role) {
//       await updateRole(role.id, name, selectedPermissions);
//     } else {
//       await createRole(name, selectedPermissions);
//     }
//     router.push('/dashboard/roles');
//   };

//   return (
//     <div>
//       <h1 className='mb-4 text-xl font-bold'>{pageTitle}</h1>
//       <form onSubmit={handleSubmit} className='space-y-6'>
//         <Input
//           type='text'
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder='Nama Role'
//         />
//         <div>
//           <h3 className='mb-2 text-lg font-bold'>Permissions</h3>
//           <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
//             {Object.entries(groupedPermissions).map(([label, perms]) => {
//               const allChecked = perms.every((perm) =>
//                 selectedPermissions.includes(perm.id)
//               );
//               return (
//                 <div key={label} className='rounded-lg border p-4 shadow'>
//                   <div className='mb-2 flex items-center justify-between border-b pb-2'>
//                     <h4 className='font-semibold capitalize'>{label}</h4>
//                     <Checkbox
//                       checked={allChecked}
//                       onCheckedChange={() => toggleGroup(label)}
//                     />
//                   </div>
//                   <div className='space-y-2'>
//                     {perms.map((perm) => (
//                       <div
//                         key={perm.id}
//                         className='flex items-center space-x-2'
//                       >
//                         <Checkbox
//                           checked={selectedPermissions.includes(perm.id)}
//                           onCheckedChange={() =>
//                             setSelectedPermissions((prev) =>
//                               prev.includes(perm.id)
//                                 ? prev.filter((id) => id !== perm.id)
//                                 : [...prev, perm.id]
//                             )
//                           }
//                         />
//                         <label>{perm.name}</label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//         <Button type='submit'>{role ? 'Update' : 'Create'} Role</Button>
//       </form>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { createRole, updateRole } from '@/actions/role-action';
import { getPermissions } from '@/actions/permission-action';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

export default function RoleForm({
  role,
  pageTitle
}: {
  role?: any;
  pageTitle: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(role?.name || '');
  const [permissions, setPermissions] = useState<
    { id: string; name: string; label: string }[]
  >([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    role?.permissionIds || []
  );

  useEffect(() => {
    async function fetchPermissions() {
      const perms = await getPermissions();
      setPermissions(perms);
    }
    fetchPermissions();
  }, []);

  const groupedPermissions = permissions.reduce(
    (acc, perm) => {
      if (!acc[perm.label]) acc[perm.label] = [];
      acc[perm.label].push(perm);
      return acc;
    },
    {} as Record<string, { id: string; name: string }[]>
  );

  const toggleGroup = (label: string) => {
    const allIds = groupedPermissions[label].map((perm) => perm.id);
    const allChecked = allIds.every((id) => selectedPermissions.includes(id));

    setSelectedPermissions((prev) =>
      allChecked
        ? prev.filter((id) => !allIds.includes(id))
        : [...prev, ...allIds.filter((id) => !prev.includes(id))]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Nama role tidak boleh kosong!');
      return;
    }

    let result;
    if (role) {
      result = await updateRole(role.id, name, selectedPermissions);
    } else {
      result = await createRole(name, selectedPermissions);
    }

    if (result.success) {
      toast.success(`Role "${name}" berhasil ${role ? 'diupdate' : 'dibuat'}!`);
      router.push('/dashboard/roles');
    } else {
      toast.error(result.error.message);
    }
  };

  return (
    <div className='mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-lg'>
      <h1 className='mb-6 text-center text-2xl font-bold'>{pageTitle}</h1>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <Label>Nama Role</Label>
          <Input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Nama Role'
            className='w-full rounded-md border p-2'
          />
        </div>
        <div>
          <h3 className='mb-3 text-lg font-bold'>Permissions</h3>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {Object.entries(groupedPermissions).map(([label, perms]) => {
              const allChecked = perms.every((perm) =>
                selectedPermissions.includes(perm.id)
              );
              return (
                <div key={label} className='rounded-lg border p-4 shadow-sm'>
                  <div className='mb-2 flex items-center justify-between border-b pb-2'>
                    <h4 className='font-semibold capitalize'>{label}</h4>
                    <Checkbox
                      checked={allChecked}
                      onCheckedChange={() => toggleGroup(label)}
                    />
                  </div>
                  <div className='space-y-2'>
                    {perms.map((perm) => (
                      <div
                        key={perm.id}
                        className='flex items-center space-x-2'
                      >
                        <Checkbox
                          checked={selectedPermissions.includes(perm.id)}
                          onCheckedChange={() =>
                            setSelectedPermissions((prev) =>
                              prev.includes(perm.id)
                                ? prev.filter((id) => id !== perm.id)
                                : [...prev, perm.id]
                            )
                          }
                        />
                        <label className='text-sm'>{perm.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Button type='submit' className='w-full py-2'>
          {role ? 'Update' : 'Create'} Role
        </Button>
      </form>
    </div>
  );
}
