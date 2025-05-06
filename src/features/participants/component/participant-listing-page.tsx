import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as ParticipantTable } from '@/components/ui/table/data-table';

import {
  getParticipants,
  ParticipantResponse
} from '@/actions/participant-action';
import { columns } from './participant-table/columns';
import { auth } from '@/lib/auth';

type ParticipantsListingPage = {};

export default async function ParticipantListingPage({}: ParticipantsListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('q');
  const pageLimit = searchParamsCache.get('limit');
  const kelasId = searchParamsCache.get('kelas');
  const subKelasId = searchParamsCache.get('subKelas');
  const session = await auth();
  const regions = session?.user.regions;

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(kelasId && { kelasId: kelasId }),
    ...(subKelasId && { subKelasId: subKelasId })
  };

  const data = await getParticipants(filters, regions);
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
