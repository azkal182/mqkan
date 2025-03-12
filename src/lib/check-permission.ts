export type User = {
  user: UserClass;
  expires: Date;
};

export type UserClass = {
  name: string;
  id: string;
  username: string;
  roles: string[];
  permissions: any[];
  regions: any[];
};

export const hasPermission = (user: User, permission: string): boolean => {
  // console.log(permission);

  return user?.user?.permissions.includes(permission);
};
