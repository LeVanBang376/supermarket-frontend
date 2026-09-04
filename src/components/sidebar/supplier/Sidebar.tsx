'use client';

import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation';

const menuItems: MenuProps['items'] = [
  {
    key: '/import-requests',
    icon: <InboxOutlined />,
    label: 'Yêu cầu nhập hàng',
  },
];

export default function SupplierSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    router.push(key);
  };

  return (
    <aside className='fixed left-0 top-0 h-screen w-64 shrink-0 border-r border-gray-200/70 bg-white shadow-[1px_0_8px_rgba(0,0,0,0.03)]'>
      <div className='flex h-16 items-center border-b border-gray-200/70 px-6'>
        <h1 className='text-lg font-semibold'>Supermarket</h1>
      </div>

      <Menu
        mode='inline'
        items={menuItems}
        selectedKeys={[pathname]}
        onClick={handleMenuClick}
        className='border-none!'
      />
    </aside>
  );
}
