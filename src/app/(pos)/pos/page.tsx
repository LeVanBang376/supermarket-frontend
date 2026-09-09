'use client';

import {
  BarcodeOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Button, Spin, message } from 'antd';
import { useState } from 'react';

import SkuSelect from '@/components/sku-select/SkuSelect';
import { useAuthStore } from '@/stores/auth-store';
import { useCreateOrder, useOrder, useOrders } from '@/queries/order';
import {
  useAddOrderItem,
  useDeleteOrderItem,
  useOrderItems,
  useUpdateOrderItem,
} from '@/queries/order-item';
import { ORDER_STATUS } from '@/types/order';
import type { SKU } from '@/types/sku';

import POSOrder from './PosOrder';
import POSPayment from './PosPayment';

type Invoice = {
  id: string;
};

const createInvoice = (id: string): Invoice => ({
  id,
});

export default function POSPage() {
  const [activeInvoiceId, setActiveInvoiceId] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);

  const branchId = user?.branch?.branch_id;

  /*
   * Get OPEN orders for current branch.
   */
  const { data: openOrdersResponse, isLoading: isLoadingOpenOrders } =
    useOrders(
      {
        branch_id: branchId,
        status: ORDER_STATUS.OPEN,
      },
      !!branchId,
    );

  const openOrders = openOrdersResponse?.data ?? [];

  /*
   * Orders are the source of truth for invoice tabs.
   */
  const invoices = openOrders.map((order) => createInvoice(order.order_id));

  /*
   * Select the first invoice automatically when there is
   * no active invoice yet.
   */
  const displayedActiveInvoiceId = activeInvoiceId ?? invoices[0]?.id ?? null;

  /*
   * Get detail of the currently active order.
   *
   * This API provides order-level information such as:
   * - subtotal
   * - discount
   * - total amount
   * - status
   * etc.
   */
  const { data: orderResponse, isLoading: isLoadingOrder } = useOrder(
    displayedActiveInvoiceId ?? '',
    !!displayedActiveInvoiceId,
  );

  const order = orderResponse?.data;

  /*
   * Get items of the currently active order.
   */
  const { data: orderItemsResponse, isLoading: isLoadingOrderItems } =
    useOrderItems(displayedActiveInvoiceId ?? '', !!displayedActiveInvoiceId);

  const orderItems = orderItemsResponse?.data ?? [];

  /*
   * Order mutations.
   */
  const createOrderMutation = useCreateOrder();
  const addOrderItemMutation = useAddOrderItem();
  const updateOrderItemMutation = useUpdateOrderItem();
  const deleteOrderItemMutation = useDeleteOrderItem();

  /*
   * Add SKU to current order.
   *
   * If SKU does not exist:
   * POST /orders/:orderId/items
   * quantity = 1
   *
   * If SKU already exists:
   * PATCH /orders/:orderId/items/:skuBarcode
   * quantity = current quantity + 1
   */
  const handleSKUChange = async (barcode: string | undefined, sku?: SKU) => {
    if (!barcode || !sku || !displayedActiveInvoiceId) return;

    const existingItem = orderItems.find(
      (item) => item.sku_barcode === barcode,
    );

    try {
      if (existingItem) {
        await updateOrderItemMutation.mutateAsync({
          orderId: displayedActiveInvoiceId,
          skuBarcode: barcode,
          data: {
            quantity: existingItem.quantity + 1,
          },
        });

        return;
      }

      await addOrderItemMutation.mutateAsync({
        orderId: displayedActiveInvoiceId,
        data: {
          sku_barcode: barcode,
          quantity: 1,
        },
      });
    } catch {
      message.error('Không thể thêm sản phẩm vào hóa đơn.');
    }
  };

  /*
   * Increase item quantity.
   *
   * Backend receives the final quantity,
   * not the quantity delta.
   */
  const increaseQuantity = async (skuBarcode: string) => {
    if (!displayedActiveInvoiceId) return;

    const item = orderItems.find((item) => item.sku_barcode === skuBarcode);

    if (!item) return;

    try {
      await updateOrderItemMutation.mutateAsync({
        orderId: displayedActiveInvoiceId,
        skuBarcode,
        data: {
          quantity: item.quantity + 1,
        },
      });
    } catch {
      message.error('Không thể cập nhật số lượng.');
    }
  };

  /*
   * Decrease item quantity.
   *
   * When quantity reaches 0, delete the item instead.
   */
  const decreaseQuantity = async (skuBarcode: string) => {
    if (!displayedActiveInvoiceId) return;

    const item = orderItems.find((item) => item.sku_barcode === skuBarcode);

    if (!item) return;

    try {
      if (item.quantity === 1) {
        await deleteOrderItemMutation.mutateAsync({
          orderId: displayedActiveInvoiceId,
          skuBarcode,
        });

        return;
      }

      await updateOrderItemMutation.mutateAsync({
        orderId: displayedActiveInvoiceId,
        skuBarcode,
        data: {
          quantity: item.quantity - 1,
        },
      });
    } catch {
      message.error('Không thể cập nhật số lượng.');
    }
  };

  /*
   * Remove one item from the current order.
   */
  const removeItem = async (skuBarcode: string) => {
    if (!displayedActiveInvoiceId) return;

    try {
      await deleteOrderItemMutation.mutateAsync({
        orderId: displayedActiveInvoiceId,
        skuBarcode,
      });
    } catch {
      message.error('Không thể xóa sản phẩm.');
    }
  };

  /*
   * Remove all items from the current order.
   */
  const clearOrder = async () => {
    if (!displayedActiveInvoiceId) return;

    try {
      await Promise.all(
        orderItems.map((item) =>
          deleteOrderItemMutation.mutateAsync({
            orderId: displayedActiveInvoiceId,
            skuBarcode: item.sku_barcode,
          }),
        ),
      );
    } catch {
      message.error('Không thể xóa toàn bộ sản phẩm.');
    }
  };

  /*
   * Create a new OPEN order and make it the active invoice.
   */
  const createInvoiceTab = async () => {
    if (!branchId) {
      message.error('Không xác định được chi nhánh hiện tại.');
      return;
    }

    try {
      const response = await createOrderMutation.mutateAsync({
        branch_id: branchId,
      });

      const order = response.data;

      setActiveInvoiceId(order.order_id);
    } catch {
      message.error('Không thể tạo hóa đơn. Vui lòng thử lại.');
    }
  };

  const handlePayment = (method: 'CASH' | 'CARD' | 'QR') => {
    const methodName = {
      CASH: 'Tiền mặt',
      CARD: 'Thẻ',
      QR: 'QR',
    }[method];

    message.success(`Thanh toán bằng ${methodName}`);
  };

  const isCreatingInvoice = createOrderMutation.isPending;

  const isLoadingInitialOrders = !!branchId && isLoadingOpenOrders;

  const isLoadingCurrentOrder =
    !!displayedActiveInvoiceId && (isLoadingOrder || isLoadingOrderItems);

  return (
    <main className='flex h-dvh max-h-dvh overflow-hidden bg-gray-100'>
      {isLoadingInitialOrders ? (
        <section className='flex min-w-0 flex-1 items-center justify-center bg-white'>
          <Spin size='large' />
        </section>
      ) : invoices.length === 0 ? (
        <section className='flex min-w-0 flex-1 items-center justify-center bg-white'>
          <Button
            type='primary'
            size='large'
            loading={isCreatingInvoice}
            onClick={createInvoiceTab}
            className='flex items-center justify-center gap-2'
          >
            {!isCreatingInvoice && <PlusOutlined />}
            <span>Tạo hóa đơn</span>
          </Button>
        </section>
      ) : (
        <section className='flex min-w-0 flex-1 flex-col'>
          <div className='shrink-0 border-b border-gray-200 bg-white'>
            {/* Invoice tabs */}
            <div className='flex h-12 items-end gap-1 overflow-x-auto px-3'>
              {invoices.map((invoice, index) => {
                const isActive = invoice.id === displayedActiveInvoiceId;

                return (
                  <button
                    key={invoice.id}
                    type='button'
                    onClick={() => setActiveInvoiceId(invoice.id)}
                    className={`flex h-10 min-w-36 items-center gap-2 rounded-t-lg border px-4 text-sm transition-colors ${
                      isActive
                        ? 'border-b-white border-gray-200 bg-white font-medium text-gray-900'
                        : 'border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <ShoppingCartOutlined />

                    <span>Hóa đơn {index + 1}</span>

                    {isActive && orderItems.length > 0 && (
                      <span className='ml-auto text-xs text-gray-400'>
                        {orderItems.reduce(
                          (total, item) => total + item.quantity,
                          0,
                        )}
                      </span>
                    )}
                  </button>
                );
              })}

              <button
                type='button'
                onClick={createInvoiceTab}
                disabled={isCreatingInvoice}
                className='flex h-10 w-10 shrink-0 items-center justify-center rounded-t-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50'
              >
                <PlusOutlined />
              </button>
            </div>

            {/* SKU search */}
            <div className='px-4 py-3'>
              <SkuSelect
                key={displayedActiveInvoiceId}
                className='w-full'
                size='large'
                value={undefined}
                placeholder='Quét mã vạch hoặc tìm kiếm SKU...'
                prefix={<BarcodeOutlined className='text-gray-400' />}
                onChange={handleSKUChange}
              />
            </div>
          </div>

          {isLoadingCurrentOrder ? (
            <section className='flex min-h-0 flex-1 items-center justify-center bg-white'>
              <Spin />
            </section>
          ) : (
            <POSOrder
              orderItems={orderItems}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onRemove={removeItem}
              onClear={clearOrder}
            />
          )}
        </section>
      )}

      <POSPayment order={order} onPayment={handlePayment} />
    </main>
  );
}
