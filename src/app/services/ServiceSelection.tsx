'use client';

import {
  BankOutlined,
  DownOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Dropdown, message } from 'antd';
import type { MenuProps } from 'antd';
import { useRouter } from 'next/navigation';

import { useLogout } from '@/queries/auth';
import { useAuthStore } from '@/stores/auth-store';

type Service = {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  bgColor: string;
};

const services: Service[] = [
  {
    id: 'supermarket',
    name: 'Supermarket',
    description: 'Quản lý hệ thống siêu thị',
    path: '/import-requests',
    icon: <BankOutlined />,
    bgColor: 'bg-blue-500',
  },
  {
    id: 'pos',
    name: 'POS',
    description: 'Bán hàng tại quầy',
    path: '/pos',
    icon: <ShoppingCartOutlined />,
    bgColor: 'bg-green-500',
  },
];

export function ServiceSelection() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);

  const { mutateAsync: logout, isPending } = useLogout();

  const handleLogout = async () => {
    try {
      await logout();

      clearUser();

      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);

      message.error('Đăng xuất thất bại');
    }
  };

  const accountMenu: MenuProps['items'] = [
    {
      key: 'logout',
      label: isPending ? 'Đang đăng xuất...' : 'Đăng xuất',
      icon: <LogoutOutlined />,
      danger: true,
      disabled: isPending,
      onClick: handleLogout,
    },
  ];

  const handleServiceClick = (service: Service) => {
    router.push(service.path);
  };

  return (
    <main className='min-h-screen bg-gray-50 px-6 py-12'>
      <div className='mx-auto max-w-6xl'>
        {/* Header */}
        <div className='mb-10 flex items-center justify-between rounded-xl bg-white px-6 py-5 shadow-sm'>
          <div>
            <h1 className='text-2xl font-semibold text-gray-900'>
              Supermarket
            </h1>
          </div>

          <Dropdown
            menu={{ items: accountMenu }}
            trigger={['click']}
            placement='bottomRight'
          >
            <button
              type='button'
              className='flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-gray-100'
            >
              <Avatar icon={<UserOutlined />} />

              <div className='flex flex-col items-start'>
                <span className='text-sm font-medium text-gray-900'>
                  {user?.full_name}
                </span>

                <span className='text-xs text-gray-500'>
                  {user?.position?.position_name}
                </span>
              </div>

              <DownOutlined className='text-xs text-gray-400' />
            </button>
          </Dropdown>
        </div>

        {/* Title */}
        <h2 className='mb-5 text-xl font-semibold text-gray-900'>
          Chọn hệ thống
        </h2>

        {/* Services */}
        <div className='flex flex-wrap gap-4'>
          {services.map((service) => (
            <div
              key={service.id}
              className='w-full max-w-[274px] rounded-xl bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md'
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-lg text-xl text-white ${service.bgColor}`}
              >
                {service.icon}
              </div>

              <div className='mt-4'>
                <h3 className='text-base font-semibold text-gray-900'>
                  {service.name}
                </h3>

                <p className='mt-1 text-sm text-gray-500'>
                  {service.description}
                </p>
              </div>

              <Button
                block
                className='mt-4'
                onClick={() => handleServiceClick(service)}
              >
                Sử dụng ngay
              </Button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
