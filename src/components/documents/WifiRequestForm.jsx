import React, { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "../ui/use-toast";
import { submitWifiRequest } from '../../api/forms';

const WifiRequestForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    pengguna_baru: '',
    pergantian_mac: '',
    komputer: '',
    laptop: '',
    handphone: '',
    nomor: '',
    nama: '',
    nrp: '',
    department: '',
    jabatan: '',
    mess: '',
    diluar: '',
    alamat: '',
    brand: '',
    type: '',
    mac: '',
    serial: '',
    keperluan: '',
    hari: '',
    te: '',
    diketahui: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleDeviceTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      komputer: type === 'komputer' ? '✓' : '',
      laptop: type === 'laptop' ? '✓' : '',
      handphone: type === 'handphone' ? '✓' : ''
    }));
  };

  const handleLocationChange = (location) => {
    setFormData(prev => ({
      ...prev,
      mess: location === 'mess' ? '✓' : '',
      diluar: location === 'diluar' ? '✓' : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await submitWifiRequest(formData);
      toast({
        title: "Success",
        description: `Request submitted with serial number: ${response.serial_number}`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="max-w-3xl max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>Wi-Fi Access Request Form</DialogTitle>
      </DialogHeader>

      <ScrollArea className="h-[70vh] pr-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Request Type */}
          <div className="space-y-4">
            <Label>Request Type</Label>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pengguna_baru"
                  checked={formData.pengguna_baru === '✓'}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, pengguna_baru: checked ? '✓' : '' }))
                  }
                />
                <label htmlFor="pengguna_baru">New User</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pergantian_mac"
                  checked={formData.pergantian_mac === '✓'}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, pergantian_mac: checked ? '✓' : '' }))
                  }
                />
                <label htmlFor="pergantian_mac">MAC Change</label>
              </div>
            </div>
          </div>

          {/* Device Type */}
          <div className="space-y-4">
            <Label>Device Type</Label>
            <div className="flex space-x-4">
              {['komputer', 'laptop', 'handphone'].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={formData[type] === '✓'}
                    onCheckedChange={() => handleDeviceTypeChange(type)}
                  />
                  <label htmlFor={type} className="capitalize">{type}</label>
                </div>
              ))}
            </div>
          </div>

          {/* User Information */}
          <div className="space-y-4">
            <h3 className="font-medium">User Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nomor">Phone Number</Label>
                <Input
                  id="nomor"
                  value={formData.nomor}
                  onChange={(e) => setFormData(prev => ({ ...prev, nomor: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nama">Full Name *</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nrp">NRP *</Label>
                <Input
                  id="nrp"
                  value={formData.nrp}
                  onChange={(e) => setFormData(prev => ({ ...prev, nrp: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jabatan">Position *</Label>
                <Input
                  id="jabatan"
                  value={formData.jabatan}
                  onChange={(e) => setFormData(prev => ({ ...prev, jabatan: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="font-medium">Location</h3>
            <div className="flex space-x-4 mb-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mess"
                  checked={formData.mess === '✓'}
                  onCheckedChange={() => handleLocationChange('mess')}
                />
                <label htmlFor="mess">Mess</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="diluar"
                  checked={formData.diluar === '✓'}
                  onCheckedChange={() => handleLocationChange('diluar')}
                />
                <label htmlFor="diluar">Outside</label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="alamat">Address</Label>
              <Input
                id="alamat"
                value={formData.alamat}
                onChange={(e) => setFormData(prev => ({ ...prev, alamat: e.target.value }))}
              />
            </div>
          </div>

          {/* Device Details */}
          <div className="space-y-4">
            <h3 className="font-medium">Device Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type/Model *</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mac">MAC Address *</Label>
                <Input
                  id="mac"
                  value={formData.mac}
                  onChange={(e) => setFormData(prev => ({ ...prev, mac: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serial">Serial Number *</Label>
                <Input
                  id="serial"
                  value={formData.serial}
                  onChange={(e) => setFormData(prev => ({ ...prev, serial: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="font-medium">Additional Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="keperluan">Purpose *</Label>
                <Input
                  id="keperluan"
                  value={formData.keperluan}
                  onChange={(e) => setFormData(prev => ({ ...prev, keperluan: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hari">Day</Label>
                <Input
                  id="hari"
                  value={formData.hari}
                  onChange={(e) => setFormData(prev => ({ ...prev, hari: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="te">TE</Label>
                <Input
                  id="te"
                  value={formData.te}
                  onChange={(e) => setFormData(prev => ({ ...prev, te: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diketahui">Known By</Label>
                <Input
                  id="diketahui"
                  value={formData.diketahui}
                  onChange={(e) => setFormData(prev => ({ ...prev, diketahui: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </ScrollArea>
    </DialogContent>
  );
};

export default WifiRequestForm;