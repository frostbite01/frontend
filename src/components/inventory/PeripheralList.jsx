import React from 'react';
import BaseInventoryList from './BaseInventoryList';

const PeripheralList = () => {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'model', label: 'Model' },
    { key: 'serial_number', label: 'Serial Number' },
    { key: 'type', label: 'Type' },
    { key: 'assigned_to', label: 'Assigned To' },
    { key: 'status', label: 'Status' },
    { key: 'department', label: 'Department' },
    { key: 'asset_id', label: 'Asset ID' }
  ];

  const renderPeripheral = (item, columnKey) => {
    switch (columnKey) {
      case 'status':
        return <span>{item.status}</span>;
      case 'type':
        return <span>{item.type}</span>;
      default:
        return <span>{item[columnKey]}</span>;
    }
  };

  return (
    <BaseInventoryList
      category="peripherals"
      title="Peripherals"
      columns={columns}
      renderItem={renderPeripheral}
    />
  );
};

export default PeripheralList;