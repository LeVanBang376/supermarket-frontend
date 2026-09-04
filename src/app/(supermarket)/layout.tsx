import DashboardHeader from '@/components/header/DashboardHeader';
import SidebarManager from '@/components/sidebar/SidebarManager';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex min-h-screen'>
      <SidebarManager />

      <div className='ml-64 min-w-0 flex-1'>
        <DashboardHeader />

        <main className='px-6 py-4'>{children}</main>
      </div>
    </div>
  );
}
