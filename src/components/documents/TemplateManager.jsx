import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Upload, FileText, Trash2 } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { getTemplates, uploadTemplate, getTemplateFields, fillTemplate, deleteTemplate } from '../../api/documents';
import TemplateForm from './TemplateForm';

const TemplateManager = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [uploadFormData, setUploadFormData] = useState({
    file: null,
    description: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await getTemplates();
      if (response.success && response.templates) {
        setTemplates(response.templates);
      } else {
        setTemplates([]);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      setTemplates([]);
      toast({
        title: "Error",
        description: "Failed to fetch templates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadFormData(prev => ({
        ...prev,
        file: file
      }));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    
    if (!uploadFormData.file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('template', uploadFormData.file);
      formData.append('description', uploadFormData.description);

      await uploadTemplate(formData);
      await fetchTemplates();
      
      // Reset form
      setUploadFormData({
        file: null,
        description: ''
      });
      setIsUploadDialogOpen(false);
      
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

  const handleDeleteTemplate = (template) => {
    toast({
      title: "Info",
      description: "Delete functionality needs to be implemented on the backend",
    });
  };

  const confirmDelete = async () => {
    if (!templateToDelete) return;

    try {
      await deleteTemplate(tetmplateToDelete.id);
      await fetchTemplates();
      
      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setTemplateToDelete(null);
    }
  };

  const handleFillTemplate = async (template) => {
    try {
      const fieldsResponse = await getTemplateFields(template.id);
      
      if (fieldsResponse.fields && fieldsResponse.fields.length > 0) {
        setSelectedTemplate({ 
          id: template.id,
          name: template.templateName, 
          fields: fieldsResponse.fields 
        });
        setIsDialogOpen(true);
      } else {
        toast({
          title: "Info",
          description: "This template has no fillable fields",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get template fields",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Document Templates</h2>
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Template
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Template Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead>Uploaded By</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  <span className="ml-2">Loading templates...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : templates && templates.length > 0 ? (
            templates.map((template) => (
              <TableRow key={template.id}>
                <TableCell className="font-medium">{template.templateName}</TableCell>
                <TableCell>{template.description || '-'}</TableCell>
                <TableCell>{formatDate(template.uploadDate)}</TableCell>
                <TableCell>{template.uploader?.name || '-'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFillTemplate(template)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Fill
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                <p className="text-sm text-muted-foreground">
                  No templates available.
                </p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Upload Template Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Template</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-file">Template File</Label>
              <Input
                id="template-file"
                type="file"
                accept=".docx"
                onChange={handleFileSelect}
                required
              />
              {uploadFormData.file && (
                <p className="text-sm text-muted-foreground">
                  Selected: {uploadFormData.file.name}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="template-description">Description</Label>
              <Textarea
                id="template-description"
                placeholder="Enter a description for this template..."
                value={uploadFormData.description}
                onChange={(e) => setUploadFormData(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                rows={3}
              />
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setUploadFormData({ file: null, description: '' });
                  setIsUploadDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading || !uploadFormData.file}>
                {isUploading ? "Uploading..." : "Upload Template"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{templateToDelete?.templateName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Fill Template Dialog */}
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
                  const blob = await fillTemplate(selectedTemplate.id, formData);
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `filled_${selectedTemplate.name}.docx`;
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