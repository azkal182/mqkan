import { getOfficials } from '@/actions/official-action';
import OfficialTable from './official-table';
import { getRegions } from '@/actions/region-action';
import { auth } from '@/lib/auth';

export default async function OfficialsPage() {
  const session = await auth();
  const data = await getOfficials(session?.user.regions);
  const regions = await getRegions();

  return (
    <div className='container mx-auto py-10'>
      <OfficialTable data={data} regions={regions} />
    </div>
  );
}
