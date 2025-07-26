import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItems, deleteItem } from '../../api/inventory';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Edit, Trash2, MoreHorizontal, Plus, Search, Loader2 } from 'lucide-react';

const InventoryList = ({ title, columns = [], formatData, category }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    const fetchInventoryData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getItems(category);
        console.log(`Received ${category} data:`, data); // Debug log
        setItems(data);
      } catch (err) {
        console.error(`Error fetching ${category}:`, err);
        setError(err.message || `Failed to fetch ${category}`);
        toast({
          title: 'Error',
          description: err.message || `Failed to fetch ${category}`,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, [category, toast]);

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setAlertDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      await deleteItem(itemToDelete.id, category);
      setItems(items.filter(item => item.id !== itemToDelete.id));
      toast({
        title: 'Item deleted',
        description: 'The item has been successfully deleted',
      });
      setAlertDialogOpen(false);
    } catch (err) {
      console.error('Error deleting item:', err);
      toast({
        title: 'Error deleting item',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const handleAddNew = () => {
    navigate(`/inventory/new`);
  };

  const handleEdit = (id) => {
    navigate(`/inventory/edit/${id}`);
  };

  const filteredItems = items.filter(item => {
    if (!searchTerm) return true;
    
    return Object.entries(item).some(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });
  });

  const getStatusBadge = (status) => {
    if (!status) return null;
    
    const statusLower = status.toLowerCase();
    if (statusLower === 'active' || statusLower === 'available') {
      return <Badge variant="success">Active</Badge>;
    } else if (statusLower === 'maintenance') {
      return <Badge variant="warning">Maintenance</Badge>;
    } else if (statusLower === 'inactive' || statusLower === 'expired') {
      return <Badge variant="destructive">Inactive</Badge>;
    }
    return <Badge>{status}</Badge>;
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">{title || category}</CardTitle>
            <CardDescription>
              Manage your {title?.toLowerCase() || category} inventory
            </CardDescription>
          </div>
          <Button onClick={handleAddNew} className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Add New
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
              No items found. Add a new one to get started.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns && columns.length > 0 ? columns.map(column => (
                      <TableHead key={column.key}>{column.label}</TableHead>
                    )) : (
                      <>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                      </>
                    )}
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map(item => {
                    const formattedItem = formatData ? formatData(item) : item;
                    return (
                      <TableRow key={item.id}>
                        {columns && columns.length > 0 ? columns.map(column => (
                          <TableCell key={column.key}>
                            {column.key === 'status' 
                              ? getStatusBadge(formattedItem[column.key]) 
                              : formattedItem[column.key] || '-'}
                          </TableCell>
                        )) : (
                          <>
                            <TableCell>{item.name || '-'}</TableCell>
                            <TableCell>{getStatusBadge(item.status)}</TableCell>
                          </>
                        )}
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEdit(item.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              {isAdmin && (
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteClick(item)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the item
                  {itemToDelete ? ` "${itemToDelete.name}"` : ''}. This action
                  cannot be undone.
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
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryList;