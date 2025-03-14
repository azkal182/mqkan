import { getUsers, UserWithRolesAndRegions } from '@/actions/user-action';
import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as UserTable } from '@/components/ui/table/data-table';
import { columns } from './user-tables/columns';

type UserListingPage = {};

export default async function UserListingPage({}: UserListingPage) {
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

  const data = await getUsers(filters);
  const totalUsers = data.totalUsers;
  const products: UserWithRolesAndRegions[] = data.users;

  return (
    <UserTable columns={columns} data={products} totalItems={totalUsers} />
  );
}
