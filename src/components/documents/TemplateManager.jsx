import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Upload, FileText, Download } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { getTemplates, uploadTemplate, getTemplateFields, fillTemplate } from '../../api/documents';
import TemplateForm from './TemplateForm';

const TemplateManager = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch templates",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await uploadTemplate(file);
      await fetchTemplates();
      toast({
        title: "Success",
        description: "Template uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload template",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFillTemplate = async (templateName) => {
    try {
      const fields = await getTemplateFields(templateName);
      setSelectedTemplate({ name: templateName, fields });
      setIsDialogOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get template fields",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Document Templates</h2>
        <div className="flex gap-4">
          <Input
            type="file"
            accept=".docx"
            onChange={handleFileUpload}
            className="hidden"
            id="template-upload"
          />
          <Button asChild disabled={isUploading}>
            <label htmlFor="template-upload">
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload Template"}
            </label>
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Template Name</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.name}>
              <TableCell>{template.name}</TableCell>
              <TableCell>{new Date(template.uploadDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFillTemplate(template.name)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Fill Template
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fill Template: {selectedTemplate?.name}</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <TemplateForm
              fields={selectedTemplate.fields}
              templateName={selectedTemplate.name}
              onSubmit={async (formData) => {
                try {
                  const blob = await fillTemplate(selectedTemplate.name, formData);
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `filled_${selectedTemplate.name}`;
                  a.click();
                  setIsDialogOpen(false);
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "Failed to fill template",
                    variant: "destructive",
                  });
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplateManager;