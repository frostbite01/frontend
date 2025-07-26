import React from 'react';
import BaseInventoryList from './BaseInventoryList';

const CctvNvrList = () => {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'model', label: 'Model' },
    { key: 'serial_number', label: 'Serial Number' },
    { key: 'ip_address', label: 'IP Address' },
    { key: 'storage_capacity', label: 'Storage Capacity' },
    { key: 'channel_count', label: 'Channel Count' },
    { key: 'location', label: 'Location' },
    { key: 'status', label: 'Status' },
    { key: 'department', label: 'Department' },
    { key: 'asset_id', label: 'Asset ID' }
  ];

  const renderCctvNvr = (item, columnKey) => {
    switch (columnKey) {
      case 'status':
        return <span>{item.status}</span>;
      default:
        return <span>{item[columnKey]}</span>;
    }
  };

  return (
    <BaseInventoryList
      category="cctv-nvr"
      title="CCTV NVRs"
      columns={columns}
      renderItem={renderCctvNvr}
    />
  );
};

export default CctvNvrList;