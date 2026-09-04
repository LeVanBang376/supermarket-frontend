'use client';

import { Select, Spin } from 'antd';
import type { SelectProps } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { useInfiniteSKUs } from '@/queries/sku';

import type { SKU } from '@/types/sku';

interface SKUSelectProps extends Omit<
  SelectProps<string>,
  'options' | 'onChange'
> {
  onChange?: (value: string | undefined, sku?: SKU) => void;
}

export default function SkuSelect({
  value,
  onChange,
  ...props
}: SKUSelectProps) {
  const [search, setSearch] = useState('');

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteSKUs(search);

  const skus = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const options = useMemo(
    () =>
      skus.map((sku) => ({
        value: sku.sku_barcode,
        label: sku.sku_name,
        sku,
      })),
    [skus],
  );

  useEffect(() => {
    if (!value) return;

    const selectedSKU = skus.find((sku) => sku.sku_barcode === value);

    if (!selectedSKU) {
      // Selected SKU không nằm trong page hiện tại.
      // Trường hợp này sẽ xử lý riêng nếu cần.
    }
  }, [value, skus]);

  const handleChange = (skuBarcode: string) => {
    const sku = skus.find((item) => item.sku_barcode === skuBarcode);

    onChange?.(skuBarcode, sku);
  };

  const handlePopupScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;

    const isBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 20;

    if (isBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <Select<string>
      {...props}
      value={value}
      popupMatchSelectWidth={false}
      styles={{
        popup: {
          root: {
            width: 500,
          },
        },
      }}
      showSearch={{
        filterOption: false,
        onSearch: setSearch,
      }}
      onChange={handleChange}
      options={options}
      optionRender={(option) => {
        const sku = option.data.sku as SKU;

        return (
          <div className='flex gap-2'>
            <span className='font-mono'>{sku.sku_barcode}</span>
            <span className='text-gray-400'>-</span>
            <span>{sku.sku_name}</span>
          </div>
        );
      }}
      labelRender={(option) => option.value}
      loading={isLoading}
      onPopupScroll={handlePopupScroll}
      notFoundContent={isLoading ? <Spin size='small' /> : 'Không tìm thấy SKU'}
      popupRender={(menu) => (
        <>
          {menu}

          {isFetchingNextPage && (
            <div className='flex justify-center py-2'>
              <Spin size='small' />
            </div>
          )}

          {!hasNextPage && skus.length > 0 && (
            <div className='py-2 text-center text-xs text-gray-400'>
              Đã hiển thị tất cả SKU
            </div>
          )}
        </>
      )}
    />
  );
}
