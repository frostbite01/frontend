import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table';
import { Upload, Download } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { getUserSignedDocuments, uploadSignedDocument, downloadSignedDocument } from '../../api/documents';

const SignedDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await getUserSignedDocuments();
      setDocuments(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await uploadSignedDocument(file);
      await fetchDocuments();
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (id, filename) => {
    try {
      const blob = await downloadSignedDocument(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Signed Documents</h2>
        <div className="flex gap-4">
          <Input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="document-upload"
          />
          <Button asChild disabled={isUploading}>
            <label htmlFor="document-upload">
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload Document"}
            </label>
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document Name</TableHead>
            <TableHead>Uploaded By</TableHead> 
            <TableHead>Role</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>{doc.fileName}</TableCell>
              <TableCell>{doc.name}</TableCell>
              <TableCell>{doc.role}</TableCell>
              <TableCell>{new Date(doc.uploadedAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(doc.id, doc.fileName)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SignedDocuments;