import React from 'react';
import BaseInventoryList from './BaseInventoryList';

const PrinterList = () => {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'model', label: 'Model' },
    { key: 'serial_number', label: 'Serial Number' },
    { key: 'toner_model', label: 'Toner Model' },
    { key: 'paper_size_supported', label: 'Paper Size' },
    { key: 'network_enabled', label: 'Network Enabled' },
    { key: 'location', label: 'Location' },
    { key: 'assigned_to', label: 'Assigned To' },
    { key: 'status', label: 'Status' },
    { key: 'department', label: 'Department' },
    { key: 'asset_id', label: 'Asset ID' }
  ];

  const renderPrinter = (item, columnKey) => {
    switch (columnKey) {
      case 'network_enabled':
        return <span>{item.network_enabled ? 'Yes' : 'No'}</span>;
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
      category="printers"
      title="Printers"
      columns={columns}
      renderItem={renderPrinter}
    />
  );
};

export default PrinterList;