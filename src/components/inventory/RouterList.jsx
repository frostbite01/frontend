import React from 'react';
import BaseInventoryList from './BaseInventoryList';

const RouterList = () => {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'model', label: 'Model' },
    { key: 'serial_number', label: 'Serial Number' },
    { key: 'ip_address', label: 'IP Address' },
    { key: 'firmware_version', label: 'Firmware Version' },
    { key: 'location', label: 'Location' },
    { key: 'assigned_to', label: 'Assigned To' },
    { key: 'status', label: 'Status' },
    { key: 'department', label: 'Department' },
    { key: 'asset_id', label: 'Asset ID' }
  ];

  const renderRouter = (item, columnKey) => {
    switch (columnKey) {
      case 'status':
        return <span>{item.status}</span>;
      case 'location':
        return <span>{item.locationInfo ? item.locationInfo.location : '-'}</span>;
      case 'department':
        return <span>{item.departmentInfo ? item.departmentInfo.department : '-'}</span>;
      default:
        return <span>{item[columnKey] || '-'}</span>;
    }
  };

  return (
    <BaseInventoryList
      category="routers"
      title="Routers"
      columns={columns}
      renderItem={renderRouter}
    />
  );
};

export default RouterList;