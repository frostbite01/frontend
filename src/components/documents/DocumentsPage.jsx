import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card';
import FormSubmissionHistory from './FormSubmissionHistory';
import WifiRequestForm from './WifiRequestForm';
import CCTVRequestForm from './CCTVRequestForm';
import SoftwareRequestForm from './SoftwareRequestForm';
import { Dialog } from '../ui/dialog';
import { 
  Wifi, 
  FileText, 
  Package, 
  ArrowLeftRight, 
  Trash2,
  Radio,
  Download,
  Camera,
  HardDrive,
  Mail,
  AlertTriangle,
  Monitor
} from 'lucide-react';

const FORM_CARDS = [
  {
    id: 'wifi',
    title: 'Registrasi Wi-Fi',
    description: 'Request form for Wi-Fi access registration',
    icon: Wifi,
    color: 'text-blue-500',
    formKey: 'WIFI_REGISTRATION'
  },
  {
    id: 'software-hardware',
    title: 'Pengadaan Software dan Hardware',
    description: 'Request for software and hardware procurement',
    icon: Package,
    color: 'text-purple-500',
    formKey: 'SOFTWARE_HARDWARE_REQUEST'
  },
  {
    id: 'ict-handover',
    title: 'Serah Terima Inventaris ICT',
    description: 'ICT inventory handover form',
    icon: FileText,
    color: 'text-green-500',
    formKey: 'ICT_HANDOVER'
  },
  {
    id: 'asset-destruction',
    title: 'Pemusnahan Barang',
    description: 'Asset destruction request form',
    icon: Trash2,
    color: 'text-red-500',
    formKey: 'ASSET_DESTRUCTION'
  },
  {
    id: 'asset-mutation',
    title: 'Mutasi Asset',
    description: 'Asset transfer between departments',
    icon: ArrowLeftRight,
    color: 'text-orange-500',
    formKey: 'ASSET_MUTATION'
  },
  {
    id: 'radio-frequency',
    title: 'Penggunaan Frekuensi Radio',
    description: 'Radio frequency usage request',
    icon: Radio,
    color: 'text-yellow-500',
    formKey: 'RADIO_FREQUENCY'
  },
  {
    id: 'software-installation',
    title: 'Permintaan Instalasi Software',
    description: 'Software installation request',
    icon: Download,
    color: 'text-indigo-500',
    formKey: 'SOFTWARE_INSTALLATION'
  },
  {
    id: 'cctv-access',
    title: 'Akses CCTV',
    description: 'CCTV access request form',
    icon: Camera,
    color: 'text-cyan-500',
    formKey: 'CCTV_ACCESS'
  },
  {
    id: 'synology-recovery',
    title: 'Pemulihan Data Synology',
    description: 'Synology data recovery request',
    icon: HardDrive,
    color: 'text-teal-500',
    formKey: 'SYNOLOGY_RECOVERY'
  },
  {
    id: 'synology-drive',
    title: 'Akses Synology Drive',
    description: 'Synology drive access request',
    icon: HardDrive,
    color: 'text-emerald-500',
    formKey: 'SYNOLOGY_DRIVE'
  },
  {
    id: 'email-creation',
    title: 'Permohonan Pembuatan Akun Email',
    description: 'Email account creation request',
    icon: Mail,
    color: 'text-pink-500',
    formKey: 'EMAIL_CREATION'
  },
  {
    id: 'asset-issue',
    title: 'Mutasi/Kerusakan/Kehilangan Asset',
    description: 'Asset issue report form',
    icon: AlertTriangle,
    color: 'text-rose-500',
    formKey: 'ASSET_ISSUE'
  }
];

const DocumentsPage = () => {
  const [showWifiForm, setShowWifiForm] = useState(false);
  const [showCCTVForm, setShowCCTVForm] = useState(false);
  const [showSoftwareForm, setShowSoftwareForm] = useState(false);

  const handleCardClick = (formKey) => {
    switch (formKey) {
      case 'WIFI_REGISTRATION':
        setShowWifiForm(true);
        break;
      case 'CCTV_ACCESS':
        setShowCCTVForm(true);
        break;
      case 'SOFTWARE_INSTALLATION':
        setShowSoftwareForm(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="forms" className="space-y-6">
        <TabsList>
          <TabsTrigger value="forms">Available Forms</TabsTrigger>
          <TabsTrigger value="history">Request Submitted</TabsTrigger>
        </TabsList>

        <TabsContent value="forms">
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FORM_CARDS.map((card) => (
                <Card 
                  key={card.id}
                  className="cursor-pointer hover:shadow-lg transition-all border-muted"
                  onClick={() => handleCardClick(card.formKey)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <card.icon className={`h-6 w-6 ${card.color}`} />
                      <div>
                        <CardTitle className="text-lg">{card.title}</CardTitle>
                        <CardDescription>{card.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="p-6">
            <FormSubmissionHistory />
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showWifiForm} onOpenChange={setShowWifiForm}>
        <WifiRequestForm onClose={() => setShowWifiForm(false)} />
      </Dialog>

      <Dialog open={showCCTVForm} onOpenChange={setShowCCTVForm}>
        <CCTVRequestForm onClose={() => setShowCCTVForm(false)} />
      </Dialog>

      <Dialog open={showSoftwareForm} onOpenChange={setShowSoftwareForm}>
        <SoftwareRequestForm onClose={() => setShowSoftwareForm(false)} />
      </Dialog>
    </div>
  );
};

export default DocumentsPage;