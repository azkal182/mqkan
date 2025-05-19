'use client';

import { DataTable as ParticipantTable } from '@/components/ui/table/data-table'; // Import the reusable DataTable
import { columns } from './participant-table/columns'; // Columns definition
import { ParticipantResponse } from '@/actions/participant-action';

interface Props {
  data: ParticipantResponse[];
  totalItems: number;
}

export default function ParticipantsTableClient({ data, totalItems }: Props) {
  return (
    <ParticipantTable
      columns={columns}
      data={data}
      totalItems={totalItems}
      getRowClassName={(row) =>
        row.original.statusCenter
          ? row.original.checkIn === true
            ? 'bg-blue-100'
            : 'bg-green-100'
          : ''
      }
    />
  );
}
