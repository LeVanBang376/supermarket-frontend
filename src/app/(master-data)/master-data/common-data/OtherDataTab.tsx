'use client';

import {
  AppstoreOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Input, Spin } from 'antd';
import { useMemo, useState } from 'react';

import { useBrands } from '@/queries/brand';
import { useUnits } from '@/queries/unit';

type OtherDataType = 'units' | 'brands';

const dataTypes = [
  {
    key: 'units' as const,
    label: 'Đơn vị tính',
  },
  {
    key: 'brands' as const,
    label: 'Hãng',
  },
];

export default function OtherDataTab() {
  const [activeType, setActiveType] = useState<OtherDataType>('units');
  const [search, setSearch] = useState('');

  const unitsQuery = useUnits();
  const brandsQuery = useBrands();

  const currentLabel =
    dataTypes.find((item) => item.key === activeType)?.label ?? '';

  const currentItems = useMemo(() => {
    const items =
      activeType === 'units'
        ? (unitsQuery.data?.data ?? []).map((unit) => ({
            code: unit.unit_id,
            name: unit.unit_name,
          }))
        : (brandsQuery.data?.data ?? []).map((brand) => ({
            code: brand.brand_id,
            name: brand.brand_name,
          }));

    if (!search.trim()) {
      return items;
    }

    const keyword = search.toLowerCase().trim();

    return items.filter(
      (item) =>
        item.code.toLowerCase().includes(keyword) ||
        item.name.toLowerCase().includes(keyword),
    );
  }, [activeType, search, unitsQuery.data, brandsQuery.data]);

  const isLoading =
    activeType === 'units' ? unitsQuery.isLoading : brandsQuery.isLoading;

  const isError =
    activeType === 'units' ? unitsQuery.isError : brandsQuery.isError;

  return (
    <div className='flex min-h-[calc(100vh-120px)]'>
      {/* Left menu */}
      <aside className='w-48 shrink-0 border-r border-gray-200 pr-3'>
        <div className='space-y-0.5'>
          {dataTypes.map((item) => {
            const isActive = activeType === item.key;

            return (
              <button
                key={item.key}
                type='button'
                onClick={() => {
                  setActiveType(item.key);
                  setSearch('');
                }}
                className={`
                  w-full rounded-md px-3 py-2 text-left text-sm
                  transition-colors
                  ${
                    isActive
                      ? 'font-medium text-green-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Content */}
      <main className='min-w-0 flex-1 pl-5'>
        <div className='mb-5 flex items-center justify-between'>
          <h1 className='text-lg font-semibold text-gray-900'>
            {currentLabel}
          </h1>

          <div className='flex items-center gap-2'>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size='middle'
              placeholder='Tìm kiếm'
              prefix={<SearchOutlined className='text-gray-400' />}
              className='w-52'
              allowClear
            />

            <Button type='primary' icon={<PlusOutlined />}>
              Thêm
            </Button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className='flex min-h-40 items-center justify-center'>
            <Spin />
          </div>
        )}

        {/* Error */}
        {isError && !isLoading && (
          <div className='flex min-h-40 items-center justify-center text-sm text-red-500'>
            Không thể tải dữ liệu. Vui lòng thử lại.
          </div>
        )}

        {/* Data */}
        {!isLoading && !isError && (
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3'>
            {currentItems.map((item) => (
              <div
                key={item.code}
                className='flex min-h-20 cursor-pointer items-center gap-3 rounded-md border border-gray-200 bg-white px-4 py-3 transition-all hover:border-gray-300 hover:shadow-sm'
              >
                <AppstoreOutlined className='shrink-0 text-xl text-gray-400' />

                <div className='min-w-0'>
                  <div className='text-xs text-gray-500'>{item.code}</div>

                  <div className='truncate text-sm font-medium text-gray-900'>
                    {item.name}
                  </div>
                </div>
              </div>
            ))}

            {currentItems.length === 0 && (
              <div className='col-span-full py-10 text-center text-sm text-gray-400'>
                {search
                  ? 'Không tìm thấy dữ liệu phù hợp.'
                  : 'Chưa có dữ liệu.'}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
