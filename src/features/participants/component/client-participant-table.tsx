'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { ParticipantResponse } from '@/actions/participant-action';
import { ColumnDef } from '@tanstack/react-table';

type ClientParticipantTableProps = {
  columns: ColumnDef<ParticipantResponse>[];
  data: ParticipantResponse[];
  totalItems: number;
};

export default function ClientParticipantTable({
  columns,
  data,
  totalItems
}: ClientParticipantTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      totalItems={totalItems}
      getRowClassName={(row) =>
        row.original.statusRegion ? 'bg-green-100' : ''
      }
    />
  );
}
