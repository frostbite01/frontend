import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { ScrollArea } from "../ui/scroll-area";
import { ImageIcon } from "lucide-react";

const ViewModal = ({ item, open, onOpenChange, title }) => {
  if (!item) return null;

  const formatValue = (key, value) => {
    if (value === null || value === undefined) return '-';
    
    switch (key) {
      case 'status':
        return (
          <Badge variant={
            value === 'active' ? 'success' : 
            value === 'inactive' ? 'destructive' : 
            'secondary'
          }>
            {value}
          </Badge>
        );
      case 'createdAt':
      case 'updatedAt':
      case 'purchase_date':
      case 'warranty_expiry':
        return value ? format(new Date(value), 'MMM d, yyyy, HH:mm') : '-';
      case 'vlan_supported':
      case 'poe_supported':
      case 'network_enabled':
        return value ? 'Yes' : 'No';
      case 'images':
        if (!value || value.length === 0) return '-';
        return (
          <div className="flex gap-2">
            {value.map((image, index) => (
              <img 
                key={image.id} 
                src={`http://localhost:3000/${image.file_path}`}
                alt={`Item image ${index + 1}`}
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
        );
      default:
        return value.toString();
    }
  };

  const fieldGroups = {
    main: ['asset_id', 'name', 'model', 'serial_number'],
    details: ['processor', 'ram_size', 'storage', 'os', 'ip_address', 'mac_address'],
    network: ['vlan_supported', 'poe_supported', 'bandwidth', 'port_count', 'ssid'],
    assignments: ['assigned_to'],
    location: [
      { key: 'location', value: item.locationInfo?.location },
      { key: 'department', value: item.departmentInfo?.department }
    ],
    status: ['status'],
    dates: ['purchase_date', 'warranty_expiry', 'createdAt', 'updatedAt'],
    images: ['images']
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[600px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(fieldGroups).map(([groupName, fields]) => {
              // Skip empty groups
              const hasData = fields.some(field => {
                const value = typeof field === 'object' ? field.value : item[field];
                return value !== undefined && value !== null;
              });

              if (!hasData) return null;

              return (
                <div key={groupName} className="space-y-3">
                  <h3 className="font-semibold text-base capitalize">{groupName}</h3>
                  <div className="space-y-2">
                    {fields.map(field => {
                      const fieldKey = typeof field === 'object' ? field.key : field;
                      const fieldValue = typeof field === 'object' ? field.value : item[field];

                      if (fieldValue === undefined || fieldValue === null) return null;

                      return (
                        <div key={fieldKey} className="flex justify-between items-start">
                          <span className="text-sm text-muted-foreground capitalize">
                            {fieldKey.replace(/_/g, ' ')}:
                          </span>
                          <div className="text-sm font-medium text-right">
                            {formatValue(fieldKey, fieldValue)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewModal;