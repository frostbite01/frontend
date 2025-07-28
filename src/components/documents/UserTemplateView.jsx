import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { FileText } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { getTemplates, getTemplateFields, fillTemplate } from '../../api/documents';
import TemplateForm from './TemplateForm';

const UserTemplateView = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
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

  const handleFormSubmit = async (formData) => {
    try {
      const blob = await fillTemplate(selectedTemplate.name, formData);
      // Create and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `filled_${selectedTemplate.name}`;
      a.click();
      
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Document generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate document",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Available Templates</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Template Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.name}>
              <TableCell>{template.name}</TableCell>
              <TableCell>{template.description || '-'}</TableCell>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Fill Template: {selectedTemplate?.name}</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <TemplateForm
              fields={selectedTemplate.fields}
              templateName={selectedTemplate.name}
              onSubmit={handleFormSubmit}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserTemplateView;