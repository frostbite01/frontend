import React from 'react';
import BaseInventoryList from './BaseInventoryList';

const WirelessDeviceList = () => {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'model', label: 'Model' },
    { key: 'serial_number', label: 'Serial Number' },
    { key: 'ip_address', label: 'IP Address' },
    { key: 'frequency', label: 'Frequency' },
    { key: 'range_km', label: 'Range (km)' },
    { key: 'location', label: 'Location' },
    { key: 'status', label: 'Status' },
    { key: 'department', label: 'Department' },
    { key: 'asset_id', label: 'Asset ID' }
  ];

  const renderWirelessDevice = (item, columnKey) => {
    switch (columnKey) {
      case 'range_km':
        return <span>{item.range_km} km</span>;
      case 'status':
        return <span>{item.status}</span>;
      default:
        return <span>{item[columnKey]}</span>;
    }
  };

  return (
    <BaseInventoryList
      category="wireless-devices"
      title="Wireless Devices"
      columns={columns}
      renderItem={renderWirelessDevice}
    />
  );
};

export default WirelessDeviceList;