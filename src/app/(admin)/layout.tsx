import Sidebar from '@/components/sidebar/Sidebar';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className='flex min-h-screen'>
        <Sidebar />

        <main className='ml-64 min-w-0 flex-1 px-6 py-4'>{children}</main>
      </div>
    </>
  );
}
