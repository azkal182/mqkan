// import KBar from '@/components/kbar';
// import AppSidebar from '@/components/layout/app-sidebar';
// import Header from '@/components/layout/header';
// import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
// import type { Metadata } from 'next';
// import { cookies } from 'next/headers';

// export const metadata: Metadata = {
//   title: 'Dashboard MQKAN',
//   description: 'MQK Amtsilati Nusantara'
// };

// export default async function DashboardLayout({
//   children
// }: {
//   children: React.ReactNode;
// }) {
//   // Persisting the sidebar state in the cookie.
//   const cookieStore = await cookies();
//   const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';
//   return (
//     <KBar>
//       <SidebarProvider defaultOpen={defaultOpen}>
//         <AppSidebar />
//         <SidebarInset>
//           <Header />
//           {/* page main content */}
//           {children}
//           {/* page main content ends */}
//         </SidebarInset>
//       </SidebarProvider>
//     </KBar>
//   );
// }

import OverflowHiddenFix from '@/app/overflow-hidden-fix';
import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Dashboard MQKAN',
  description: 'MQK Amtsilati Nusantara'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';
  return (
    <div className='admin-layout'>
      <OverflowHiddenFix />
      <KBar>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <SidebarInset>
            <Header />
            {/* page main content */}
            {children}
            {/* page main content ends */}
          </SidebarInset>
        </SidebarProvider>
      </KBar>
    </div>
  );
}
