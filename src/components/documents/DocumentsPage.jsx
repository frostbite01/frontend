import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card';
import FormSubmissionHistory from './FormSubmissionHistory';
import WifiRequestForm from './WifiRequestForm';
import { Dialog } from '../ui/dialog';
import { Wifi, FileText } from 'lucide-react';

const DocumentsPage = () => {
  const [showWifiForm, setShowWifiForm] = useState(false);

  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="forms" className="space-y-6">
        <TabsList>
          <TabsTrigger value="forms">Available Forms</TabsTrigger>
          <TabsTrigger value="history">Request Submitted</TabsTrigger>
        </TabsList>

        <TabsContent value="forms">
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all border-blue-200"
                onClick={() => setShowWifiForm(true)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Wifi className="h-6 w-6 text-blue-500" />
                    <div>
                      <CardTitle className="text-lg">Wi-Fi Access Request</CardTitle>
                      <CardDescription>Request form for Wi-Fi access registration</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Dummy cards */}
              <Card className="cursor-pointer hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-green-500" />
                    <div>
                      <CardTitle className="text-lg">Leave Request</CardTitle>
                      <CardDescription>Submit your leave application</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-yellow-500" />
                    <div>
                      <CardTitle className="text-lg">Expense Claim</CardTitle>
                      <CardDescription>Submit expense reimbursement request</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="p-6">
            <FormSubmissionHistory />
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showWifiForm} onOpenChange={setShowWifiForm}>
        <WifiRequestForm onClose={() => setShowWifiForm(false)} />
      </Dialog>
    </div>
  );
};

export default DocumentsPage;