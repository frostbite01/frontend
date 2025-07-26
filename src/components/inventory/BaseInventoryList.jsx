import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { useToast } from '../ui/use-toast';
import { axiosWithAuth } from "../../api/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog"
import InventoryForm from './InventoryForm';
import { Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "../ui/alert-dialog"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { getItemById, createItem, updateItem, getItemsWithDetails } from '../../api/inventory';
import ViewModal from './ViewModal';
import ImageCarousel from './ImageCarousel';

const BaseInventoryList = ({ category, title, columns, renderItem }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemDetails, setItemDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const { toast } = useToast();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedViewItem, setSelectedViewItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const data = await getItemsWithDetails(category);
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
        toast({
          title: "Error",
          description: "Failed to fetch items",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [category, toast]);

  const handleOpenDialog = () => {
    setSelectedItem(null);
    setItemDetails(null); // Reset itemDetails when adding a new item
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleEdit = async (item) => {
    setSelectedItem(item);
    try {
      const response = await getItemById(item.id, category);
      setItemDetails(response);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching item details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch item details",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (item) => {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Are you sure you want to delete this item?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={async () => {
            try {
              await axiosWithAuth.delete(`http://localhost:3000/api/inventory/${category}/${item.id}`);
              toast({
                title: 'Success',
                description: 'Item deleted successfully',
              });
              // Refresh items
              const response = await axiosWithAuth.get(`http://localhost:3000/api/inventory/${category}`);
              setItems(response.data);
            } catch (error) {
              console.error('Error deleting item:', error);
              toast({
                title: 'Error',
                description: error.message || 'Failed to delete item',
                variant: 'destructive',
              });
            }
          }}>Continue</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    )
  };

  const handleFormSubmit = async (formData) => {
    console.log('handleFormSubmit called with:', formData);
    try {
      if (selectedItem) {
        console.log('Updating item:', selectedItem.id);
        await updateItem(selectedItem.id, formData, category);
      } else {
        console.log('Creating new item');
        await createItem(formData, category);
      }
      console.log('API call successful');
      // Refresh the items list after update or create
      const response = await axiosWithAuth.get(`http://localhost:3000/api/inventory/${category}`);
      setItems(response.data);
      handleCloseDialog();
      toast({
        title: 'Success',
        description: selectedItem ? 'Item updated successfully' : 'Item created successfully',
      });
    } catch (error) {
      console.error('handleFormSubmit error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save item',
        variant: 'destructive',
      });
    }
  };

  const handleRowClick = (item) => {
    setSelectedViewItem(item);
    setViewModalOpen(true);
  };

  const renderCell = (item, column) => {
    if (column.key === 'image') {
      return <ImageCarousel images={item.images} />;
    }
    return renderItem(item, column.key);
  };

  const filteredItems = items.filter(item => {
    const searchRegex = new RegExp(searchTerm, 'i');
    const matchesSearch = columns.some(column => {
      const columnValue = item[column.key];
      return columnValue && searchRegex.test(columnValue.toString());
    });

    const matchesStatus = statusFilter ? item.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  useMemo(() => {
    return itemDetails || {};
  }, [itemDetails]);

  if (loading) {
    return <p>Loading {title}...</p>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 pb-2">
        <div className="flex-1 text-center md:text-left">
          <CardTitle className="text-2xl font-bold">{title || category}</CardTitle>
          <CardDescription>
            Manage your {title?.toLowerCase() || category} inventory
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleOpenDialog}>Add New</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow 
                key={item.id} 
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => handleRowClick(item)}
              >
                {columns.map((column) => (
                  <TableCell key={`${item.id}-${column.key}`}>
                    {renderCell(item, column)}
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {handleDelete(item)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <ViewModal 
        item={selectedViewItem}
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        title={`${title} Details`}
      />

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedItem ? `Edit ${title}` : `Create New ${title}`}</DialogTitle>
            <DialogDescription>
              Make sure to fill all the required fields.
            </DialogDescription>
          </DialogHeader>
          <InventoryForm
            category={category}
            columns={columns}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseDialog}
            initialData={itemDetails}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default BaseInventoryList;