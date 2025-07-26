import React from 'react';
import BaseInventoryList from './BaseInventoryList';

const SwitchList = () => {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'model', label: 'Model' },
    { key: 'serial_number', label: 'Serial Number' },
    { key: 'ip_address', label: 'IP Address' },
    { key: 'port_count', label: 'Port Count' },
    { key: 'vlan_supported', label: 'VLAN Supported' },
    { key: 'poe_supported', label: 'POE Supported' },
    { key: 'location', label: 'Location' },
    { key: 'assigned_to', label: 'Assigned To' },
    { key: 'status', label: 'Status' },
    { key: 'department', label: 'Department' },
    { key: 'asset_id', label: 'Asset ID' }
  ];

  const renderSwitch = (item, columnKey) => {
    switch (columnKey) {
      case 'vlan_supported':
        return <span>{item.vlan_supported ? 'Yes' : 'No'}</span>;
      case 'poe_supported':
        return <span>{item.poe_supported ? 'Yes' : 'No'}</span>;
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
      category="switches"
      title="Switches"
      columns={columns}
      renderItem={renderSwitch}
    />
  );
};

export default SwitchList;