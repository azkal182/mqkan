import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as ParticipantTable } from '@/components/ui/table/data-table';

import {
  getParticipants,
  ParticipantResponse
} from '@/actions/participant-action';
import { columns } from './participant-table/columns';

type ParticipantsListingPage = {};

export default async function ParticipantListingPage({}: ParticipantsListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('q');
  const pageLimit = searchParamsCache.get('limit');
  const roleId = searchParamsCache.get('roleId');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(roleId && { roleId: roleId })
  };

  const data = await getParticipants(filters);
  const totalUsers = data.meta.total;
  const participants: ParticipantResponse[] = data.data;

  return (
    <ParticipantTable
      columns={columns}
      data={participants}
      totalItems={totalUsers}
    />
  );
}
