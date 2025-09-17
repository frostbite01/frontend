import React, { useState, useEffect, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { getMyFormSubmissions } from '../../api/forms';
import { downloadFilledDocx } from '../../api/forms';

const FORM_TYPES = {
  SOFTWARE_HARDWARE_REQUEST: {
    label: 'Pengadaan Software dan Hardware',
    columns: ['No Surat', 'Tanggal', 'Jenis Pengadaan', 'Deskripsi', 'Pemohon', 'Departemen', 'Status', 'Actions']
  },
  WIFI_REGISTRATION: {
    label: 'Registrasi Wi-Fi',
    columns: ['No Surat', 'Tanggal', 'Tipe Device', 'MAC Address', 'Pemohon', 'Departemen', 'Status', 'Actions']
  },
  ICT_HANDOVER: {
    label: 'Serah Terima Inventaris ICT',
    columns: ['No Surat', 'Tanggal', 'Jenis Asset', 'Serial Number', 'Diserahkan Oleh', 'Diterima Oleh', 'Status', 'Actions']
  },
  ASSET_DESTRUCTION: {
    label: 'Pemusnahan Barang',
    columns: ['No Surat', 'Tanggal', 'Jenis Asset', 'Alasan', 'Pemohon', 'Disetujui Oleh', 'Status', 'Actions']
  },
  ASSET_MUTATION: {
    label: 'Mutasi Asset',
    columns: ['No Surat', 'Tanggal', 'Asset', 'Dari', 'Ke', 'Alasan', 'Pemohon', 'Status', 'Actions']
  },
  RADIO_FREQUENCY: {
    label: 'Penggunaan Frekuensi Radio',
    columns: ['No Surat', 'Tanggal', 'Frekuensi', 'Lokasi', 'Durasi', 'Pemohon', 'Status', 'Actions']
  },
  SOFTWARE_INSTALLATION: {
    label: 'Permintaan Instalasi Software',
    columns: ['No Surat', 'Tanggal', 'Software', 'Device', 'Alasan', 'Pemohon', 'Status', 'Actions']
  },
  CCTV_ACCESS: {
    label: 'Akses CCTV',
    columns: ['No Surat', 'Tanggal', 'Lokasi CCTV', 'Durasi', 'Alasan', 'Pemohon', 'Status', 'Actions']
  },
  SYNOLOGY_RECOVERY: {
    label: 'Pemulihan Data Synology',
    columns: ['No Surat', 'Tanggal', 'Jenis Data', 'Path', 'Alasan', 'Pemohon', 'Status', 'Actions']
  },
  SYNOLOGY_DRIVE: {
    label: 'Akses Synology Drive',
    columns: ['No Surat', 'Tanggal', 'Tipe Akses', 'Path', 'Keperluan', 'Pemohon', 'Status', 'Actions']
  },
  EMAIL_CREATION: {
    label: 'Permohonan Pembuatan Akun Email',
    columns: ['No Surat', 'Tanggal', 'Email', 'Nama', 'Departemen', 'Pemohon', 'Status', 'Actions']
  },
  ASSET_ISSUE: {
    label: 'Mutasi/Kerusakan/Kehilangan Asset',
    columns: ['No Surat', 'Tanggal', 'Asset', 'Kategori', 'Keterangan', 'Pemohon', 'Status', 'Actions']
  }
};

const STATUS_STYLES = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Verified': 'bg-green-100 text-green-800',
  'Rejected': 'bg-red-100 text-red-800',
  'Processing': 'bg-blue-100 text-blue-800'
};

const FormSubmissionHistory = () => {
  const [selectedFormType, setSelectedFormType] = useState('SOFTWARE_HARDWARE_REQUEST');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      // TODO: Update API call to include form type
      const data = await getMyFormSubmissions(selectedFormType);
      setSubmissions(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load submission history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedFormType, toast]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const renderCellContent = (column, submission) => {
    switch (column) {
      case 'Serial Number':
        return submission.serial_number;
      case 'Date':
        return new Date(submission.date).toLocaleDateString();
      case 'Status':
        return (
          <Badge className={STATUS_STYLES[submission.status.toLowerCase()]}>
            {submission.status}
          </Badge>
        );
      case 'Submitter':
        return (
          <div className="text-sm">
            <div className="font-medium">{submission.submitter?.name}</div>
            <div className="text-xs text-muted-foreground">{submission.submitter?.email}</div>
          </div>
        );
      case 'Department':
        return submission.submitter?.department;
      case 'Device Type':
        return [
          submission.komputer === '✓' && 'Computer',
          submission.laptop === '✓' && 'Laptop',
          submission.handphone === '✓' && 'Mobile Phone'
        ].filter(Boolean).join(', ') || '-';
      case 'MAC Address':
        return submission.mac || '-';
      case 'Actions':
        return (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => console.log('Download:', submission.serial_number)}
          >
            Download
          </Button>
        );
      default:
        // For any other column, try to get the value from the submission object
        const key = column.toLowerCase().replace(/ /g, '_');
        return submission[key] || '-';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 p-1">
        {Object.entries(FORM_TYPES).map(([key, { label }]) => (
          <Button
            key={key}
            variant={selectedFormType === key ? "default" : "outline"}
            size="sm"
            className="w-full text-sm"
            onClick={() => setSelectedFormType(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      <ScrollArea className="h-[600px]">
        <Table>
          <TableHeader>
            <TableRow>
              {FORM_TYPES[selectedFormType].columns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={FORM_TYPES[selectedFormType].columns.length}
                  className="text-center py-10"
                >
                  No submissions found for this form type
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((submission) => (
                <TableRow key={submission.id}>
                  {FORM_TYPES[selectedFormType].columns.map((column) => (
                    <TableCell key={column}>
                      {renderCellContent(column, submission)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default FormSubmissionHistory;