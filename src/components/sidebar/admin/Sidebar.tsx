'use client';

import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
  AppstoreOutlined,
  InboxOutlined,
  DatabaseOutlined,
  ShopOutlined,
  BarcodeOutlined,
} from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation';

const menuItems: MenuProps['items'] = [
  {
    key: '/',
    icon: <AppstoreOutlined />,
    label: 'Tổng quan',
  },
  {
    key: '/import-requests',
    icon: <InboxOutlined />,
    label: 'Yêu cầu nhập hàng',
  },
  {
    key: 'master-data',
    icon: <DatabaseOutlined />,
    label: 'Master data',
    children: [
      {
        key: '/master-data/common-data',
        icon: <DatabaseOutlined />,
        label: 'Dữ liệu chung',
      },
      {
        key: '/master-data/skus',
        icon: <BarcodeOutlined />,
        label: 'SKU',
      },
    ],
  },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    router.push(key);
  };

  return (
    <aside className='fixed left-0 top-0 h-screen w-64 shrink-0 border-r border-gray-200/70 bg-white shadow-[1px_0_8px_rgba(0,0,0,0.03)]'>
      <div className='flex h-16 items-center border-b border-gray-200/70 px-6'>
        <div className='flex h-16 items-center border-b border-gray-200/70 px-6'>
          <button
            type='button'
            onClick={() => router.push('/services')}
            className='cursor-pointer text-lg font-semibold transition-colors hover:text-blue-500'
          >
            Supermarket
          </button>
        </div>
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
