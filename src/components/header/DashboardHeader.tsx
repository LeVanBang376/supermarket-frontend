'use client';

import { DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown } from 'antd';
import type { MenuProps } from 'antd';

import { useAuthStore } from '@/stores/auth-store';

export default function DashboardHeader() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();

    // TODO: gọi API logout nếu backend có endpoint logout
    // Sau đó redirect về /login
  };

  const items: MenuProps['items'] = [
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  if (!user) {
    return (
      <header className='flex h-16 items-center justify-end border-b border-gray-200/80 bg-white px-6 shadow-sm'>
        <Avatar icon={<UserOutlined />} />
      </header>
    );
  }

  return (
    <header className='flex h-16 items-center justify-end border-b border-gray-200/80 bg-white px-6 shadow-sm'>
      <Dropdown menu={{ items }} trigger={['click']} placement='bottomRight'>
        <button
          type='button'
          className='flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-gray-100'
        >
          <Avatar>{user.full_name.charAt(0).toUpperCase()}</Avatar>

          <div className='flex flex-col items-start'>
            <span className='text-sm font-medium text-gray-900'>
              {user.full_name}
            </span>

            <span className='text-xs text-gray-500'>{user.role.role_name}</span>
          </div>

          <DownOutlined className='text-xs text-gray-400' />
        </button>
      </Dropdown>
    </header>
  );
}
