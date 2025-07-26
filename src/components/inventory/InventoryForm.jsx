import React, { useState, useEffect } from 'react';
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { axiosWithAuth } from "../../api/auth";
import { ImageIcon, Loader2, X } from "lucide-react";
import { uploadImage } from '../../api/images';
import { toast } from '../ui/use-toast';

const InventoryForm = ({ category, columns, onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState(initialData || {});
  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(initialData?.image || null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosWithAuth.get("http://localhost:3000/api/common/locanddept");
        console.log("Locations data:", response.data.locations);
        console.log("Departments data:", response.data.departments);
        setLocations(response.data.locations);
        setDepartments(response.data.departments);
      } catch (error) {
        console.error("Error fetching locations and departments:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: parseInt(value, 10),
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Upload image
      const response = await uploadImage(file);
      
      // Update form data with image filename
      setFormData(prev => ({
        ...prev,
        image: response.filename
      }));

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setFormData(prev => ({
      ...prev,
      image: null
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Filter out asset_id, location, and department from columns
  const filteredColumns = columns.filter(column => 
    !['asset_id', 'location', 'department'].includes(column.key)
  );

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {/* Image Upload Section */}
      <div className="space-y-2 mb-4">
        <Label>Item Image</Label>
        <div className="flex items-start gap-4">
          <div className="w-32 h-32 relative rounded-lg border-2 border-dashed border-muted-foreground/25">
            {preview ? (
              <div className="relative w-full h-full">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 bg-background/80 hover:bg-background"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                {uploading ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  <>
                    <ImageIcon className="h-8 w-8 mb-2" />
                    <span className="text-xs text-center px-2">
                      Click to upload
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={uploading}
                />
              </label>
            )}
          </div>
          <div className="flex-1 text-sm text-muted-foreground">
            <p>Accepted file types: .jpg, .jpeg, .png</p>
            <p>Maximum file size: 5MB</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredColumns.map((column) => (
          <div key={column.key} className="grid gap-2">
            <Label htmlFor={column.key}>{column.label}</Label>
            <Input
              type="text"
              id={column.key}
              name={column.key}
              value={formData[column.key] || ''}
              onChange={handleChange}
            />
          </div>
        ))}
        <div className="grid gap-2">
          <Label htmlFor="locationId">Location</Label>
          <Select 
            value={formData.locationId ? formData.locationId.toString() : ''} 
            onValueChange={(value) => handleSelectChange("locationId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id.toString()}>
                  {location.location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="departmentId">Department</Label>
          <Select 
            value={formData.departmentId ? formData.departmentId.toString() : ''} 
            onValueChange={(value) => handleSelectChange("departmentId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((department) => (
                <SelectItem key={department.id} value={department.id.toString()}>
                  {department.department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

export default InventoryForm;