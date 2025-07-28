import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';

const TemplateForm = ({ fields, onSubmit }) => {
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>{field.replace(/_/g, ' ')}</Label>
              <Input
                id={field}
                value={formData[field] || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  [field]: e.target.value
                })}
                required
              />
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="flex justify-end space-x-2 mt-4">
        <Button type="submit">
          Generate Document
        </Button>
      </div>
    </form>
  );
};

export default TemplateForm;