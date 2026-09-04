'use client';

import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useState } from 'react';

import BranchesTab from './BranchesTab';
import OtherDataTab from './OtherDataTab';

export default function MasterDataPage() {
  const [activeTab, setActiveTab] = useState('branches');

  const items: TabsProps['items'] = [
    {
      key: 'branches',
      label: 'Chi nhánh',
      children: <BranchesTab />,
    },
    {
      key: 'other-data',
      label: 'Các dữ liệu khác',
      children: <OtherDataTab />,
    },
  ];

  return (
    <div className='min-h-screen bg-white'>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </div>
  );
}
