import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Dialog, DialogContent, DialogOverlay, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Checkbox } from '../ui/checkbox';
import {
  Wifi, Monitor, Camera, FileText, Network, Server, 
  Smartphone, Printer, Lock, Mail, HardDrive, Building
} from 'lucide-react';
import { useToast } from '../ui/use-toast';

const SERVICES = {
  network_access: {
    icon: Wifi,
    title: 'Network Access Request',
    description: 'Request access to corporate network resources',
    color: 'text-blue-500',
    longDesc: 'Get secure access to our corporate network infrastructure including WiFi, VPN, and internal resources.',
    documents: [
      { id: 'device_form', name: 'Device Registration Form', required: true },
      { id: 'policy_form', name: 'Acceptable Use Policy', required: true },
      { id: 'id_scan', name: 'Employee ID Scan', required: true }
    ]
  },
  hardware_support: {
    icon: Monitor,
    title: 'Hardware Support',
    description: 'Request hardware maintenance or replacement',
    color: 'text-green-500',
    longDesc: 'Get support for company-issued hardware including laptops, desktops, and peripherals.',
    documents: [
      { id: 'hardware_form', name: 'Hardware Request Form', required: true },
      { id: 'manager_approval', name: 'Manager Approval', required: true }
    ]
  },
  cctv_installation: {
    icon: Camera,
    title: 'CCTV Installation',
    description: 'Request new CCTV installation or maintenance',
    color: 'text-yellow-500',
    longDesc: 'Install or maintain surveillance systems for enhanced security monitoring.',
    documents: [
      { id: 'location_form', name: 'Location Survey Form', required: true },
      { id: 'budget_approval', name: 'Budget Approval', required: true },
      { id: 'layout_plan', name: 'Installation Layout', required: false }
    ]
  },
  server_access: {
    icon: Server,
    title: 'Server Access Request',
    description: 'Request access to server resources',
    color: 'text-purple-500',
    longDesc: 'Get authorized access to specific server resources and databases.',
    documents: [
      { id: 'access_form', name: 'Server Access Form', required: true },
      { id: 'security_policy', name: 'Security Policy Agreement', required: true }
    ]
  },
  mobile_device: {
    icon: Smartphone,
    title: 'Mobile Device Registration',
    description: 'Register corporate mobile devices',
    color: 'text-pink-500',
    longDesc: 'Register and configure corporate mobile devices for secure access.',
    documents: [
      { id: 'device_reg', name: 'Device Registration', required: true },
      { id: 'mdm_consent', name: 'MDM Consent Form', required: true }
    ]
  },
  printer_setup: {
    icon: Printer,
    title: 'Printer Configuration',
    description: 'Setup network printers',
    color: 'text-cyan-500',
    longDesc: 'Configure and set up network printers for your department.',
    documents: [
      { id: 'printer_form', name: 'Printer Access Form', required: true }
    ]
  },
  security_access: {
    icon: Lock,
    title: 'Security Access',
    description: 'Request security clearance and access',
    color: 'text-red-500',
    longDesc: 'Apply for security clearance and physical access to restricted areas.',
    documents: [
      { id: 'clearance_form', name: 'Security Clearance Form', required: true },
      { id: 'background_check', name: 'Background Check Consent', required: true },
      { id: 'access_policy', name: 'Access Policy Agreement', required: true }
    ]
  },
  email_setup: {
    icon: Mail,
    title: 'Email Configuration',
    description: 'Setup corporate email access',
    color: 'text-orange-500',
    longDesc: 'Configure and set up corporate email accounts and related services.',
    documents: [
      { id: 'email_form', name: 'Email Request Form', required: true },
      { id: 'usage_policy', name: 'Email Usage Policy', required: true }
    ]
  },
  storage_request: {
    icon: HardDrive,
    title: 'Storage Request',
    description: 'Request additional storage space',
    color: 'text-indigo-500',
    longDesc: 'Request additional storage space for departmental or project needs.',
    documents: [
      { id: 'storage_form', name: 'Storage Request Form', required: true },
      { id: 'justification', name: 'Need Justification', required: true }
    ]
  },
  facility_access: {
    icon: Building,
    title: 'Facility Access',
    description: 'Request access to facilities',
    color: 'text-emerald-500',
    longDesc: 'Get access to specific facility areas and resources.',
    documents: [
      { id: 'facility_form', name: 'Facility Access Form', required: true },
      { id: 'safety_training', name: 'Safety Training Certificate', required: true }
    ]
  }
};

const ServiceRequest = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleServiceClick = (serviceKey) => {
    setSelectedService(SERVICES[serviceKey]);
    setUploadedDocs({});
    setIsDialogOpen(true);
  };

  const handleFileUpload = (documentId) => {
    // Simulate file upload
    setUploadedDocs(prev => ({
      ...prev,
      [documentId]: true
    }));
    toast({
      title: "Document Uploaded",
      description: "Document has been uploaded successfully",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(SERVICES).map(([key, service]) => (
        <Card 
          key={key}
          className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
          onClick={() => handleServiceClick(key)}
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <service.icon className={`h-6 w-6 ${service.color}`} />
              <CardTitle>{service.title}</CardTitle>
            </div>
            <CardDescription>{service.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogOverlay className="fixed inset-0 z-50 bg-transparent backdrop-blur-2xl transition-all" />
        <DialogContent className="max-w-4xl max-h-[90vh] border-0 bg-white/10 dark:bg-gray-950/10 backdrop-blur-xl backdrop-saturate-150 rounded-2xl shadow-2xl">
          <DialogHeader className="border-b border-white/20 dark:border-gray-800/20 bg-white/20 dark:bg-gray-950/20 rounded-t-2xl px-6 py-4">
            <div className="flex items-center gap-3">
              {selectedService?.icon && (
                <selectedService.icon className={`h-8 w-8 ${selectedService.color}`} />
              )}
              <div>
                <DialogTitle className="text-2xl font-semibold">{selectedService?.title}</DialogTitle>
                <p className="text-muted-foreground/80 mt-1">{selectedService?.description}</p>
              </div>
            </div>
          </DialogHeader>
          
          <ScrollArea className="mt-6 px-6">
            <div className="space-y-6">
              {/* Service Description */}
              <div className="bg-white/10 dark:bg-gray-950/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">About This Service</h3>
                <p className="text-muted-foreground/80">{selectedService?.longDesc}</p>
              </div>

              {/* Required Documents */}
              <div className="bg-white/10 dark:bg-gray-950/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Required Documents</h3>
                <div className="space-y-4">
                  {selectedService?.documents.map((doc) => (
                    <div 
                      key={doc.id} 
                      className="flex items-center justify-between p-4 rounded-lg border border-white/20 dark:border-gray-800/20 bg-white/5 dark:bg-gray-950/5 backdrop-blur-md hover:bg-white/10 dark:hover:bg-gray-950/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={uploadedDocs[doc.id]} 
                          onCheckedChange={() => {}} 
                          className="bg-white/20 dark:bg-gray-950/20"
                        />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground/70">
                            {doc.required ? 'Required' : 'Optional'}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={uploadedDocs[doc.id] ? "outline" : "default"}
                        className="bg-white/20 dark:bg-gray-950/20 hover:bg-white/30 dark:hover:bg-gray-950/30 backdrop-blur-md"
                        onClick={() => handleFileUpload(doc.id)}
                      >
                        {uploadedDocs[doc.id] ? 'Uploaded' : 'Upload'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="mt-6 flex justify-end gap-3 border-t border-white/20 dark:border-gray-800/20 bg-white/20 dark:bg-gray-950/20 rounded-b-2xl px-6 py-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="bg-white/20 dark:bg-gray-950/20 hover:bg-white/30 dark:hover:bg-gray-950/30 backdrop-blur-md"
            >
              Cancel
            </Button>
            <Button
              disabled={!selectedService?.documents.every(doc => 
                !doc.required || uploadedDocs[doc.id]
              )}
              className="bg-primary/80 hover:bg-primary/90 backdrop-blur-md"
            >
              Submit Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceRequest;