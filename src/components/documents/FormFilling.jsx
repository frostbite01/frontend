import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { FileText, Wifi, Monitor, Camera } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { getTemplates, getTemplateFields, fillTemplate } from '../../api/documents';
import TemplateForm from './TemplateForm';

const FORM_TYPES = {
  wifi: {
    icon: Wifi,
    title: 'WiFi Access Form',
    description: 'Request WiFi access for your device',
    color: 'text-blue-500'
  },
  cctv: {
    icon: Camera,
    title: 'CCTV Installation Form',
    description: 'Request CCTV installation or maintenance',
    color: 'text-green-500'
  },
  computer: {
    icon: Monitor,
    title: 'Computer Access Form',
    description: 'Request computer access or setup',
    color: 'text-purple-500'
  }
  // Add more form types as needed
};

const FormFilling = () => {
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

  const handleCardClick = async (formType) => {
    try {
      const template = templates.find(t => t.formType === formType);
      if (!template) {
        throw new Error('Template not found');
      }

      const fields = await getTemplateFields(template.name);
      setSelectedTemplate({ ...template, fields });
      setIsDialogOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load form template",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(FORM_TYPES).map(([type, config]) => (
        <Card 
          key={type}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleCardClick(type)}
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <config.icon className={`h-6 w-6 ${config.color}`} />
              <CardTitle>{config.title}</CardTitle>
            </div>
            <CardDescription>{config.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Fill Form
            </Button>
          </CardContent>
        </Card>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate && FORM_TYPES[selectedTemplate.formType]?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <TemplateForm
              fields={selectedTemplate.fields}
              formType={selectedTemplate.formType}
              onSubmit={async (formData) => {
                try {
                  const blob = await fillTemplate(selectedTemplate.name, {
                    ...formData,
                    formType: selectedTemplate.formType
                  });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${FORM_TYPES[selectedTemplate.formType].title}.docx`;
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
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormFilling;