import React, { useState, useEffect, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "../ui/use-toast";
import { getMyFormSubmissions } from '../../api/forms';

const STATUS_STYLES = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Verified': 'bg-green-100 text-green-800',
  'Rejected': 'bg-red-100 text-red-800',
  'Processing': 'bg-blue-100 text-blue-800'
};

const FormSubmissionHistory = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMyFormSubmissions();
      setSubmissions(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load submission history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!submissions.length) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">No Submissions Found</h3>
        <p className="text-sm text-muted-foreground">
          You haven't submitted any forms yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[600px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serial Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Form Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitter</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              console.log("Submission:", submission),
              <TableRow key={submission.id}>
                <TableCell className="font-medium">
                  {submission.serial_number}
                </TableCell>
                <TableCell>
                  {new Date(submission.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{submission.formName}</TableCell>
                <TableCell>
                  <Badge className={STATUS_STYLES[submission.status]}>
                    {submission.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">{submission.submitter.name}</div>
                    <div className="text-muted-foreground">{submission.submitter.email}</div>
                    <div className="text-xs text-muted-foreground">NRP: {submission.submitter.employeeId}</div>
                  </div>
                </TableCell>
                <TableCell>{submission.submitter.department}</TableCell>
                <TableCell>{submission.submitter.position}</TableCell>
                <TableCell>
                  {submission.formType === 'WIFI_REQUEST' && (
                    <div className="text-sm">
                      <div>Device: {submission.device_type}</div>
                      <div className="text-xs text-muted-foreground">
                        MAC: {submission.mac_address}
                      </div>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default FormSubmissionHistory;