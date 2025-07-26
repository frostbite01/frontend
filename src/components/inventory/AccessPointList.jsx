import React from 'react';
import BaseInventoryList from './BaseInventoryList';

const AccessPointList = () => {
  const columns = [
    { key: 'asset_id', label: 'Asset ID' }, // Add asset_id
    { key: 'name', label: 'Name' },
    { key: 'model', label: 'Model' },
    { key: 'serial_number', label: 'Serial Number' },
    { key: 'ip_address', label: 'IP Address' },
    { key: 'ssid', label: 'SSID' },
    { key: 'location', label: 'Location' },
    { key: 'department', label: 'Department' }, // Add department
    { key: 'status', label: 'Status' },
  ];

  const renderAccessPoint = (item, columnKey) => {
    switch (columnKey) {
      case 'status':
        return <span>{item.status}</span>;
      default:
        return <span>{item[columnKey]}</span>;
    }
  };

  return (
    <BaseInventoryList
      category="access-points"
      title="Access Points"
      columns={columns}
      renderItem={renderAccessPoint}
    />
  );
};

export default AccessPointList;