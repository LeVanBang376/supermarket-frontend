'use client';

import { Card, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import dayjs from 'dayjs';

import type { ImportRequest } from '@/types/import-request';
import {
  isDeliveryLicensePlateVisible,
  isReceivingInfoVisible,
} from './helper';

interface ImportRequestInfoProps {
  request: ImportRequest;
}

export default function ImportRequestInfo({ request }: ImportRequestInfoProps) {
  const showDeliveryLicensePlate = isDeliveryLicensePlateVisible(
    request.status,
  );

  const showReceivingInfo = isReceivingInfoVisible(request.status);

  return (
    <Card title='Thông tin yêu cầu nhập hàng'>
      <Row gutter={16}>
        {/* Số phiếu */}
        <Col span={8}>
          <Form.Item label='Số phiếu nhập'>
            <Input value={request.request_id} disabled />
          </Form.Item>
        </Col>

        {/* Người tạo */}
        <Col span={8}>
          <Form.Item label='Người tạo phiếu'>
            <Input
              value={request.creator?.full_name ?? request.created_by}
              disabled
            />
          </Form.Item>
        </Col>

        {/* Ngày tạo */}
        <Col span={8}>
          <Form.Item label='Ngày tạo phiếu'>
            <Input
              value={dayjs(request.created_at).format('DD/MM/YYYY HH:mm')}
              disabled
            />
          </Form.Item>
        </Col>

        {/* Thời gian giao dự kiến */}
        <Col span={8}>
          <Form.Item
            label='Thời gian giao dự kiến'
            name='expected_delivery_at'
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn thời gian giao dự kiến',
              },
            ]}
          >
            <DatePicker
              className='w-full'
              format='DD/MM/YYYY HH:mm'
              showTime
              disabled={request.status !== 'DRAFT'}
            />
          </Form.Item>
        </Col>

        {/* Chi nhánh */}
        <Col span={8}>
          <Form.Item
            label='Chi nhánh'
            name='branch_id'
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn chi nhánh',
              },
            ]}
          >
            <Select
              options={[
                {
                  value: request.branch.branch_id,
                  label: request.branch.branch_name,
                },
              ]}
              disabled={request.status !== 'DRAFT'}
            />
          </Form.Item>
        </Col>

        {/* Biển số xe */}
        {showDeliveryLicensePlate && (
          <Col span={8}>
            <Form.Item label='Biển số xe' name='delivery_license_plate'>
              <Input placeholder='Nhập biển số xe' />
            </Form.Item>
          </Col>
        )}

        {/* Nhân viên nhận hàng */}
        {showReceivingInfo && (
          <Col span={8}>
            <Form.Item label='Nhân viên nhận hàng'>
              <Input
                value={
                  request.receiver?.full_name ?? request.received_by ?? '-'
                }
                disabled
              />
            </Form.Item>
          </Col>
        )}

        {/* Ngày hoàn thành */}
        {showReceivingInfo && (
          <Col span={8}>
            <Form.Item label='Ngày hoàn thành'>
              <Input
                value={
                  request.complete_at
                    ? dayjs(request.complete_at).format('DD/MM/YYYY HH:mm')
                    : '-'
                }
                disabled
              />
            </Form.Item>
          </Col>
        )}
      </Row>
    </Card>
  );
}
