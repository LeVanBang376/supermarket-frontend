'use client';

import { useEffect, useState } from 'react';
import {
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  SaveOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { Button, Form, Modal, Spin, Tag, message } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import dayjs from 'dayjs';

import {
  canAcceptImportRequest,
  canCompleteImportRequest,
  canSaveChanges,
  canStartDelivering,
  canSubmitImportRequest,
  importRequestStatusConfig,
} from './helper';
import {
  useConfirmImportRequest,
  useImportRequest,
  useUpdateImportRequest,
  useUpdateImportRequestStatus,
} from '@/queries/import-request';
import { useImportRequestProducts } from '@/queries/import-request-product';
import { useImportRequestTotes } from '@/queries/import-request-tote';

import ImportRequestInfo from './ImportRequestInfo';
import ImportRequestProducts from './ImportRequestProducts';
import ImportRequestTotes from './ImportRequestTotes';

import type { ImportRequestProduct } from '@/types/import-request-product';
import type {
  UpdateImportRequestRequest,
  UpdateImportRequestStatusRequest,
} from '@/types/import-request';
import { useAuthStore } from '@/stores/auth-store';
import { ImportRequestTote } from '@/types/import-request-tote';

export interface ImportRequestFormProduct extends ImportRequestProduct {
  is_new?: boolean;
  is_modified?: boolean;
}

export interface ImportRequestFormValues {
  branch_id: string;
  expected_delivery_at: dayjs.Dayjs;
  delivery_license_plate?: string;
  received_by?: string;
  products: ImportRequestFormProduct[];
  totes: ImportRequestTote[];
}

export default function ImportRequestDetailPage() {
  const router = useRouter();
  const params = useParams<{ request_id: string }>();
  const role = useAuthStore((state) => state.user?.role);

  const requestId = params.request_id;

  const [form] = Form.useForm<ImportRequestFormValues>();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isStartDeliveryModalOpen, setIsStartDeliveryModalOpen] =
    useState(false);
  const [isConfirmImportModalOpen, setIsConfirmImportModalOpen] =
    useState(false);
  const [loadingToteBarcode, setLoadingToteBarcode] = useState<string | null>(
    null,
  );

  const {
    data: requestData,
    isLoading: isRequestLoading,
    isError: isRequestError,
  } = useImportRequest(requestId, !!role);

  const {
    data: productsData,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useImportRequestProducts(requestId);

  const {
    data: totesData,
    isLoading: isTotesLoading,
    isError: isTotesError,
  } = useImportRequestTotes(requestId);

  const updateImportRequestMutation = useUpdateImportRequest();
  const updateImportRequestStatusMutation = useUpdateImportRequestStatus();
  const confirmImportRequestMutation = useConfirmImportRequest();

  const request = requestData?.data;
  const products = productsData?.data ?? [];
  const totes = totesData?.data ?? [];

  useEffect(() => {
    if (!request || isProductsLoading || isProductsError) {
      return;
    }

    form.setFieldsValue({
      branch_id: request.branch.branch_id,
      expected_delivery_at: dayjs(request.expected_delivery_at),
      delivery_license_plate: request.delivery_license_plate,
      received_by: request.received_by,

      products: products.map((product) => ({
        ...product,
        is_new: false,
        is_modified: false,
      })),
      totes: totes.map((tote) => ({
        ...tote,
        is_new: false,
        is_modified: false,
      })),
    });
  }, [form, request, totes, products, isProductsLoading, isProductsError]);

  const handleSubmit = async (values: ImportRequestFormValues) => {
    if (!request) {
      return;
    }

    const productsToUpdate = values.products
      .filter((product) => product.is_new || product.is_modified)
      .map((product) => ({
        sku_barcode: product.sku_barcode,
        quantity: product.quantity,
        loaded_quantity: product.loaded_quantity,
        received_quantity: product.received_quantity,
        tote_barcode: product.tote_barcode,
      }));

    const currentProductBarcodes = new Set(
      values.products.map((product) => product.sku_barcode).filter(Boolean),
    );

    const productsToDelete = products
      .map((product) => product.sku_barcode)
      .filter(
        (skuBarcode) => skuBarcode && !currentProductBarcodes.has(skuBarcode),
      );

    const payload: UpdateImportRequestRequest = {
      branch_id: values.branch_id,
      expected_delivery_at: values.expected_delivery_at.toISOString(),
      delivery_license_plate: values.delivery_license_plate,
      received_by: values.received_by,
      products: productsToUpdate,
      products_to_delete: productsToDelete,
    };

    // Lưu payload vào form instance để handleSave dùng lại.
    form.setFieldsValue(values);

    setIsSaveModalOpen(true);
  };

  const handleSave = async () => {
    if (!request) {
      return;
    }

    try {
      const values = form.getFieldsValue();
      console.log(values.products);
      const productsToUpdate = values.products
        .filter((product) => product.is_new || product.is_modified)
        .map((product) => ({
          sku_barcode: product.sku_barcode,
          quantity: product.quantity,
          loaded_quantity: product.loaded_quantity,
          received_quantity: product.received_quantity,
          tote_barcode: product.tote_barcode,
        }));

      const currentProductBarcodes = new Set(
        values.products.map((product) => product.sku_barcode).filter(Boolean),
      );

      const productsToDelete = products
        .map((product) => product.sku_barcode)
        .filter(
          (skuBarcode) => skuBarcode && !currentProductBarcodes.has(skuBarcode),
        );

      const payload: UpdateImportRequestRequest = {
        branch_id: values.branch_id,
        expected_delivery_at: values.expected_delivery_at.toISOString(),
        delivery_license_plate: values.delivery_license_plate,
        received_by: values.received_by,
        products: productsToUpdate,
        products_to_delete: productsToDelete,
      };

      await updateImportRequestMutation.mutateAsync({
        requestId: request.request_id,
        data: payload,
      });

      setIsSaveModalOpen(false);
      message.success('Cập nhật yêu cầu nhập hàng thành công');
    } catch {
      message.error('Cập nhật yêu cầu nhập hàng thất bại');
    }
  };

  const handleSubmitRequest = async () => {
    if (!request) {
      return;
    }

    const payload: UpdateImportRequestStatusRequest = {
      status: 'REQUIRED',
    };

    try {
      await updateImportRequestStatusMutation.mutateAsync({
        requestId: request.request_id,
        data: payload,
      });

      setIsSubmitModalOpen(false);
      message.success('Gửi yêu cầu nhập hàng thành công');
    } catch {
      message.error('Gửi yêu cầu nhập hàng thất bại');
    }
  };

  const handleAcceptImportRequest = async () => {
    if (!request) {
      return;
    }

    const payload: UpdateImportRequestStatusRequest = {
      status: 'SUPPLIER_RECEIVED',
    };

    try {
      await updateImportRequestStatusMutation.mutateAsync({
        requestId: request.request_id,
        data: payload,
      });

      setIsAcceptModalOpen(false);
      message.success('Xác nhận nhận đơn thành công');
    } catch {
      message.error('Xác nhận nhận đơn thất bại');
    }
  };

  const handleStartDelivery = async () => {
    if (!request) {
      return;
    }

    const payload: UpdateImportRequestStatusRequest = {
      status: 'DELIVERING',
    };

    try {
      await updateImportRequestStatusMutation.mutateAsync({
        requestId: request.request_id,
        data: payload,
      });

      setIsStartDeliveryModalOpen(false);
      message.success('Chuyển sang trạng thái đang giao hàng thành công');
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Không thể chuyển sang trạng thái đang giao hàng');
      }
    }
  };

  const handleConfirmImport = async () => {
    if (!request) {
      return;
    }

    try {
      await confirmImportRequestMutation.mutateAsync(request.request_id);

      setIsConfirmImportModalOpen(false);
      message.success('Hoàn tất nhận hàng thành công');
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Không thể hoàn tất nhận hàng');
      }
    }
  };

  if (!role) {
    return null;
  }

  return (
    <Form<ImportRequestFormValues>
      form={form}
      layout='vertical'
      onFinish={handleSubmit}
    >
      {isRequestLoading ? (
        <div className='flex min-h-100 items-center justify-center'>
          <Spin size='large' />
        </div>
      ) : isRequestError || !request ? (
        <div className='py-10 text-center'>
          <div className='mb-4 text-sm text-red-500'>
            Không thể tải thông tin yêu cầu nhập hàng.
          </div>

          <Button onClick={() => router.back()}>Quay lại</Button>
        </div>
      ) : (
        <div className='space-y-5'>
          {/* Header */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Button
                type='text'
                icon={<ArrowLeftOutlined />}
                onClick={() => router.back()}
              />

              <div>
                <div className='flex items-center gap-3'>
                  <h1 className='text-xl font-semibold'>
                    {request.request_id}
                  </h1>

                  <Tag
                    color={
                      importRequestStatusConfig[request.status]?.color ??
                      'default'
                    }
                  >
                    {importRequestStatusConfig[request.status]?.label ??
                      request.status}
                  </Tag>
                </div>

                <div className='text-sm text-gray-500'>
                  Chi tiết yêu cầu nhập hàng
                </div>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              {canSubmitImportRequest(role.role_id, request.status) && (
                <Button
                  type='primary'
                  icon={<SendOutlined />}
                  disabled={updateImportRequestMutation.isPending}
                  onClick={() => setIsSubmitModalOpen(true)}
                >
                  Gửi yêu cầu nhập hàng
                </Button>
              )}

              {canAcceptImportRequest(role.role_id, request.status) && (
                <Button
                  type='primary'
                  disabled={updateImportRequestStatusMutation.isPending}
                  onClick={() => setIsAcceptModalOpen(true)}
                >
                  Xác nhận nhận đơn
                </Button>
              )}

              {canStartDelivering(role.role_id, request.status) && (
                <Button
                  type='primary'
                  icon={<SendOutlined />}
                  loading={updateImportRequestStatusMutation.isPending}
                  disabled={updateImportRequestMutation.isPending}
                  onClick={() => setIsStartDeliveryModalOpen(true)}
                >
                  Giao hàng
                </Button>
              )}

              {canCompleteImportRequest(role.role_id, request.status) && (
                <Button
                  type='primary'
                  icon={<SaveOutlined />}
                  loading={confirmImportRequestMutation.isPending}
                  disabled={
                    updateImportRequestMutation.isPending ||
                    updateImportRequestStatusMutation.isPending
                  }
                  onClick={() => setIsConfirmImportModalOpen(true)}
                >
                  Hoàn tất nhận hàng
                </Button>
              )}

              {canSaveChanges(role.role_id, request.status) && (
                <Button
                  type='primary'
                  icon={<SaveOutlined />}
                  loading={updateImportRequestMutation.isPending}
                  disabled={updateImportRequestStatusMutation.isPending}
                  onClick={() => form.submit()}
                >
                  Lưu
                </Button>
              )}
            </div>
          </div>

          {/* Request information */}
          <ImportRequestInfo request={request} />

          {/* Totes */}
          {isTotesError ? (
            <div className='rounded-lg border border-red-200 py-10 text-center text-sm text-red-500'>
              Không thể tải danh sách Tote.
            </div>
          ) : isTotesLoading ? (
            <div className='flex min-h-30 items-center justify-center'>
              <Spin />
            </div>
          ) : (
            <div className='mt-6'>
              <ImportRequestTotes
                requestId={request.request_id}
                request={request}
                totes={totes}
                loadingToteBarcode={loadingToteBarcode}
                onLoadingToteChange={setLoadingToteBarcode}
              />
            </div>
          )}

          {/* Products */}
          {isProductsError ? (
            <div className='rounded-lg border border-red-200 py-10 text-center text-sm text-red-500'>
              Không thể tải danh sách hàng hóa.
            </div>
          ) : isProductsLoading ? (
            <div className='flex min-h-50 items-center justify-center'>
              <Spin />
            </div>
          ) : (
            <div className='mt-6'>
              <ImportRequestProducts
                requestId={request.request_id}
                requestStatus={request.status}
                originalProducts={products}
                activeToteBarcode={loadingToteBarcode}
              />
            </div>
          )}

          {/* Save confirmation modal */}
          <Modal
            title='Xác nhận cập nhật'
            open={isSaveModalOpen}
            centered
            onCancel={() => setIsSaveModalOpen(false)}
            onOk={handleSave}
            okText='Xác nhận'
            cancelText='Hủy'
            confirmLoading={updateImportRequestMutation.isPending}
          >
            <div className='flex items-start gap-3'>
              <ExclamationCircleOutlined className='mt-1 text-lg' />

              <span>
                Bạn có chắc chắn muốn lưu các thay đổi của yêu cầu nhập hàng này
                không?
              </span>
            </div>
          </Modal>

          {/* Submit request confirmation modal */}
          <Modal
            title='Gửi yêu cầu nhập hàng'
            open={isSubmitModalOpen}
            centered
            onCancel={() => setIsSubmitModalOpen(false)}
            onOk={handleSubmitRequest}
            okText='Gửi yêu cầu'
            cancelText='Hủy'
            confirmLoading={updateImportRequestStatusMutation.isPending}
          >
            <div className='flex items-start gap-3'>
              <ExclamationCircleOutlined className='mt-1 text-lg' />

              <span>
                Bạn có chắc chắn muốn gửi yêu cầu nhập hàng này không?
              </span>
            </div>
          </Modal>

          {/* Accept import request confirmation modal */}
          <Modal
            title='Xác nhận nhận đơn'
            open={isAcceptModalOpen}
            centered
            onCancel={() => setIsAcceptModalOpen(false)}
            onOk={handleAcceptImportRequest}
            okText='Xác nhận nhận đơn'
            cancelText='Hủy'
            confirmLoading={updateImportRequestStatusMutation.isPending}
          >
            <div className='flex items-start gap-3'>
              <ExclamationCircleOutlined className='mt-1 text-lg' />

              <span>
                Bạn có chắc chắn muốn nhận yêu cầu nhập hàng này không? Sau khi
                xác nhận, yêu cầu sẽ được chuyển sang trạng thái{' '}
                <strong>NCC đã nhận</strong>.
              </span>
            </div>
          </Modal>

          {/* Start delivery confirmation modal */}
          <Modal
            title='Xác nhận giao hàng'
            open={isStartDeliveryModalOpen}
            centered
            onCancel={() => setIsStartDeliveryModalOpen(false)}
            onOk={handleStartDelivery}
            okText='Giao hàng'
            cancelText='Hủy'
            confirmLoading={updateImportRequestStatusMutation.isPending}
          >
            <div className='flex items-start gap-3'>
              <ExclamationCircleOutlined className='mt-1 text-lg' />

              <span>
                Bạn có chắc chắn muốn chuyển yêu cầu nhập hàng này sang trạng
                thái <strong>Đang giao hàng</strong> không?
                <br />
                <br />
                Sau khi xác nhận, bạn sẽ không thể thay đổi thông tin đã xếp
                hàng.
              </span>
            </div>
          </Modal>

          {/* Confirm import confirmation modal */}
          <Modal
            title='Xác nhận hoàn tất nhận hàng'
            open={isConfirmImportModalOpen}
            centered
            onCancel={() => setIsConfirmImportModalOpen(false)}
            onOk={handleConfirmImport}
            okText='Hoàn tất nhận hàng'
            cancelText='Hủy'
            confirmLoading={confirmImportRequestMutation.isPending}
          >
            <div className='flex items-start gap-3'>
              <ExclamationCircleOutlined className='mt-1 text-lg' />

              <span>
                Bạn có chắc chắn muốn hoàn tất nhận hàng cho yêu cầu nhập hàng
                này không?
                <br />
                <br />
                Sau khi xác nhận, số lượng hàng nhận thực tế sẽ được cập nhật
                vào kho và yêu cầu sẽ chuyển sang trạng thái{' '}
                <strong>Đã hoàn tất</strong>.
              </span>
            </div>
          </Modal>
        </div>
      )}
    </Form>
  );
}
