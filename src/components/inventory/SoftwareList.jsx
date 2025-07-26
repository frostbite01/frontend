import React from 'react';
import BaseInventoryList from './BaseInventoryList';

const SoftwareList = () => {
  const columns = [
    { key: 'asset_id', label: 'Asset ID' },
    { key: 'name', label: 'Name' },
    { key: 'version', label: 'Version' },
    { key: 'license_key', label: 'License Key' },
    { key: 'purchase_date', label: 'Purchase Date' },
    { key: 'license_expiry', label: 'License Expiry' },
    { key: 'department', label: 'Department' },
    { key: 'location', label: 'Location' },
    { key: 'assigned_to', label: 'Assigned To' }
  ];

  const renderSoftware = (item, columnKey) => {
    switch (columnKey) {
      case 'purchase_date':
        return <span>{item.purchase_date ? new Date(item.purchase_date).toLocaleDateString() : 'N/A'}</span>;
      case 'license_expiry':
        return <span>{item.license_expiry ? new Date(item.license_expiry).toLocaleDateString() : 'N/A'}</span>;
      default:
        return <span>{item[columnKey]}</span>;
    }
  };

  return (
    <BaseInventoryList
      category="software"
      title="Software"
      columns={columns}
      renderItem={renderSoftware}
    />
  );
};

export default SoftwareList;