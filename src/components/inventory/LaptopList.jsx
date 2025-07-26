import React from 'react';
import BaseInventoryList from './BaseInventoryList';

const LaptopList = () => {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'model', label: 'Model' },
    { key: 'serial_number', label: 'Serial Number' },
    { key: 'processor', label: 'Processor' },
    { key: 'ram_size', label: 'RAM' },
    { key: 'storage', label: 'Storage' },
    { key: 'os', label: 'OS' },
    { key: 'ip_address', label: 'IP Address' },
    { key: 'assigned_to', label: 'Assigned To' },
    { key: 'status', label: 'Status' },
    { key: 'location', label: 'Location' },
    { key: 'department', label: 'Department' },
    { key: 'asset_id', label: 'Asset ID' }
  ];

  const renderLaptop = (item, columnKey) => {
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
      category="laptops"
      title="Laptops"
      columns={columns}
      renderItem={renderLaptop}
    />
  );
};

export default LaptopList;