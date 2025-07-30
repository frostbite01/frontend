import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { FileText, Edit3, User, Calendar, HardDrive } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { getTemplates, getTemplateFields, fillTemplate } from '../../api/documents';
import TemplateForm from './TemplateForm';

const UserTemplateView = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadingFields, setIsLoadingFields] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await getTemplates();
      console.log('Templates response:', response);
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

  const handleFillTemplate = async (template) => {
    console.log('Template object:', template);
    console.log('Template ID:', template.id);
    console.log('Template name:', template.templateName);
    console.log('Attempting to fill template:', template);
    setIsLoadingFields(true);
    try {
      const fieldsResponse = await getTemplateFields(template.id);
      console.log('Fields response:', fieldsResponse);
      
      if (fieldsResponse && fieldsResponse.fields && fieldsResponse.fields.length > 0) {
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
      console.error('Error fetching template fields:', error);
      toast({
        title: "Error",
        description: `Failed to get template fields: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoadingFields(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    console.log('Submitting form data:', formData);
    console.log('Selected template:', selectedTemplate);
    
    try {
      const blob = await fillTemplate(selectedTemplate.id, formData);
      console.log('Fill template response blob:', blob);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `filled_${selectedTemplate.name}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Document generated and downloaded successfully",
      });
    } catch (error) {
      console.error('Fill template error:', error);
      toast({
        title: "Error",
        description: `Failed to generate document: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Available Templates</h2>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span>Loading templates...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Available Templates</h2>
      
      {templates && templates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{template.templateName}</CardTitle>
                </div>
                {template.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {template.description}
                  </p>
                )}
                <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(template.uploadDate)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <HardDrive className="h-3 w-3" />
                    <span>{formatFileSize(template.fileSize)}</span>
                  </div>
                </div>
                {template.uploader && (
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                    <User className="h-3 w-3" />
                    <span>Uploaded by: {template.uploader.name}</span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-end">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleFillTemplate(template)}
                    disabled={isLoadingFields}
                    className="flex items-center space-x-1"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>{isLoadingFields ? 'Loading...' : 'Fill Template'}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No templates available
          </h3>
          <p className="text-sm text-muted-foreground">
            Templates will appear here once they are uploaded by an administrator.
          </p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader className="pb-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">
                  Fill Template: {selectedTemplate?.name}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Please fill in all the required fields below to generate your document
                </p>
              </div>
            </div>
          </DialogHeader>
          
          <div className="py-6">
            {selectedTemplate && selectedTemplate.fields && (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Document Fields
                  </h3>
                  <p className="text-sm text-gray-600">
                    Fill in the information below to complete your document. All fields marked with * are required.
                  </p>
                </div>
                
                <TemplateForm
                  fields={selectedTemplate.fields}
                  templateName={selectedTemplate.name}
                  onSubmit={handleFormSubmit}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserTemplateView;