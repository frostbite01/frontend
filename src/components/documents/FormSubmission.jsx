import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Upload, Wifi, Monitor, Camera } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { uploadSignedDocument } from '../../api/documents';

const FORM_TYPES = {
  wifi: {
    icon: Wifi,
    title: 'WiFi Access Form',
    description: 'Submit signed WiFi access form',
    color: 'text-blue-500'
  },
  cctv: {
    icon: Camera,
    title: 'CCTV Installation Form',
    description: 'Submit signed CCTV installation form',
    color: 'text-green-500'
  },
  computer: {
    icon: Monitor,
    title: 'Computer Access Form',
    description: 'Submit signed computer access form',
    color: 'text-purple-500'
  }
  // Add more form types as needed
};

const FormSubmission = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event, formType) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('signedDocument', file);
      formData.append('formType', formType);

      await uploadSignedDocument(formData);
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(FORM_TYPES).map(([type, config]) => (
        <Card key={type}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <config.icon className={`h-6 w-6 ${config.color}`} />
              <CardTitle>{config.title}</CardTitle>
            </div>
            <CardDescription>{config.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileUpload(e, type)}
              className="hidden"
              id={`upload-${type}`}
            />
            <Button 
              asChild 
              variant="ghost" 
              className="w-full"
              disabled={isUploading}
            >
              <label htmlFor={`upload-${type}`}>
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload Signed Form"}
              </label>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FormSubmission;