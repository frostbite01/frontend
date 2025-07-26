import {
  Router,
  Package,
  Monitor,
  Printer,
  Laptop,
  HardDrive,
  Box,
  Camera,
  Wifi,
  Radio,
  Users,
  ChevronDown,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  CheckSquare,
  Keyboard // Import the Keyboard icon
} from 'lucide-react';

export const categoryConfigs = {
  switches: {
    title: 'Network Switches',
    icon: Router, // Use the Router icon for switches
    color: 'text-blue-500', // Add a color property
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'model', label: 'Model' },
      { key: 'ip_address', label: 'IP Address' },
      { key: 'port_count', label: 'Ports' },
      { key: 'vlan_supported', label: 'VLAN Support' },
      { key: 'location', label: 'Location' },
      { key: 'status', label: 'Status' }
    ],
    formatData: (item) => ({
      ...item,
      vlan_supported: item.vlan_supported ? 'Yes' : 'No',
      status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : '-'
    })
  },
  
  printers: {
    title: 'Printers',
    icon: Printer, // Use the Printer icon for printers
    color: 'text-green-500', // Add a color property
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'model', label: 'Model' },
      { key: 'toner_model', label: 'Toner' },
      { key: 'paper_size_supported', label: 'Paper Size' },
      { key: 'network_enabled', label: 'Network' },
      { key: 'location', label: 'Location' },
      { key: 'status', label: 'Status' }
    ],
    formatData: (item) => ({
      ...item,
      network_enabled: item.network_enabled ? 'Yes' : 'No',
      status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : '-'
    })
  },
  
  laptops: {
    title: 'Laptops',
    icon: Laptop,
    color: 'text-purple-500', // Add a color property
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'model', label: 'Model' },
      { key: 'processor', label: 'Processor' },
      { key: 'ram_size', label: 'RAM' },
      { key: 'storage', label: 'Storage' },
      { key: 'os', label: 'OS' },
      { key: 'assigned_to', label: 'Assigned To' },
      { key: 'status', label: 'Status' }
    ],
    formatData: (item) => ({
      ...item,
      status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : '-'
    })
  },
  
  pcs: {
    title: 'Desktop PCs',
    icon: Monitor,
    color: 'text-red-500', // Add a color property
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'model', label: 'Model' },
      { key: 'processor', label: 'Processor' },
      { key: 'ram_size', label: 'RAM' },
      { key: 'storage', label: 'Storage' },
      { key: 'os', label: 'OS' },
      { key: 'assigned_to', label: 'Assigned To' },
      { key: 'status', label: 'Status' }
    ],
    formatData: (item) => ({
      ...item,
      status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : '-'
    })
  },
  
  peripherals: {
    title: 'Peripherals',
    icon: Keyboard,
    color: 'text-gray-500', // Add a color property
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'model', label: 'Model' },
      { key: 'type', label: 'Type' },
      { key: 'assigned_to', label: 'Assigned To' },
      { key: 'status', label: 'Status' }
    ],
    formatData: (item) => ({
      ...item,
      type: item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : '-',
      status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : '-'
    })
  },
  
  software: {
    title: 'Software',
    icon: Package,
    color: 'text-teal-500', // Add a color property
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'version', label: 'Version' },
      { key: 'license_key', label: 'License Key' },
      { key: 'assigned_to', label: 'Assigned To' },
      { key: 'expiry_date', label: 'Expiry Date' },
      { key: 'status', label: 'Status' }
    ],
    formatData: (item) => ({
      ...item,
      expiry_date: item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A',
      status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : '-'
    })
  },
  
  'cctv-nvr': {
    title: 'CCTV/NVR Systems',
    icon: Camera,
    color: 'text-orange-500', // Add a color property
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'model', label: 'Model' },
      { key: 'ip_address', label: 'IP Address' },
      { key: 'storage_capacity', label: 'Storage' },
      { key: 'channel_count', label: 'Channels' },
      { key: 'location', label: 'Location' },
      { key: 'status', label: 'Status' }
    ],
    formatData: (item) => ({
      ...item,
      status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : '-'
    })
  },
  
  routers: {
    title: 'Routers',
    icon: Router,
    color: 'text-yellow-500', // Add a color property
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'model', label: 'Model' },
      { key: 'ip_address', label: 'IP Address' },
      { key: 'firmware_version', label: 'Firmware' },
      { key: 'location', label: 'Location' },
      { key: 'assigned_to', label: 'Assigned To' },
      { key: 'status', label: 'Status' }
    ],
    formatData: (item) => ({
      ...item,
      status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : '-'
    })
  },
  
  'wireless-devices': {
    title: 'Wireless Devices',
    icon: Radio,
    color: 'text-lime-500', // Add a color property
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'model', label: 'Model' },
      { key: 'ip_address', label: 'IP Address' },
      { key: 'location', label: 'Location' },
      { key: 'status', label: 'Status' }
    ],
    formatData: (item) => ({
      ...item,
      status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : '-'
    })
  },
  
  'access-points': {
    title: 'Access Points',
    icon: Wifi,
    color: 'text-indigo-500', // Add a color property
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'model', label: 'Model' },
      { key: 'ip_address', label: 'IP Address' },
      { key: 'ssid', label: 'SSID' },
      { key: 'location', label: 'Location' },
      { key: 'status', label: 'Status' }
    ],
    formatData: (item) => ({
      ...item,
      status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : '-'
    })
  }
};