import React, { useState, useEffect, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search, MoreVertical } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { getAllFormSubmissions, updateSubmissionStatus } from '../../api/forms/admin';
import { FORM_TYPES, STATUS_STYLES } from '../documents/FormSubmissionHistory';

const AdminFormSubmissionHistory = () => {
  const [selectedFormType, setSelectedFormType] = useState('SOFTWARE_HARDWARE_REQUEST');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const { toast } = useToast();

  const loadSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllFormSubmissions(selectedFormType);
      setSubmissions(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load submissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedFormType, toast]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const handleStatusUpdate = async (submissionId, newStatus) => {
    try {
      await updateSubmissionStatus(submissionId, newStatus);
      toast({
        title: "Success",
        description: "Status updated successfully"
      });
      loadSubmissions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const renderCellContent = (column, submission) => {
    switch (column) {
      // ... existing cases from FormSubmissionHistory ...
      case 'Actions':
        return (
          <div className="flex items-center justify-end space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => console.log('Download:', submission.serial_number)}
            >
              Download
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => handleStatusUpdate(submission.id, 'VERIFIED')}
                >
                  Mark as Verified
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleStatusUpdate(submission.id, 'REJECTED')}
                >
                  Reject Submission
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleStatusUpdate(submission.id, 'PROCESSING')}
                >
                  Mark as Processing
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      default:
        return submission[column.toLowerCase().replace(/ /g, '_')] || '-';
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = (
      submission.serial_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.submitter?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.submitter?.department?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const matchesStatus = statusFilter === 'ALL' || submission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Form Submissions Management</h2>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by serial number, name, or department..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="VERIFIED">Verified</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="PROCESSING">Processing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Form Type Selection */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 p-1">
        {Object.entries(FORM_TYPES).map(([key, { label }]) => (
          <Button
            key={key}
            variant={selectedFormType === key ? "default" : "outline"}
            size="sm"
            className="w-full text-sm"
            onClick={() => setSelectedFormType(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Table */}
      <ScrollArea className="h-[600px]">
        <Table>
          <TableHeader>
            <TableRow>
              {FORM_TYPES[selectedFormType].columns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={FORM_TYPES[selectedFormType].columns.length}
                  className="text-center py-10"
                >
                  No submissions found
                </TableCell>
              </TableRow>
            ) : (
              filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  {FORM_TYPES[selectedFormType].columns.map((column) => (
                    <TableCell key={column}>
                      {renderCellContent(column, submission)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default AdminFormSubmissionHistory;