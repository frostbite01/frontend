import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card } from '../ui/card';
import { useAuth } from '../../context/AuthContext';
import TemplateManager from './TemplateManager';
import ServiceRequest from './ServiceRequest';
import SignedDocuments from './SignedDocuments';

const DocumentManagement = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Service Requests</h1>
      
      <Tabs defaultValue="request">
        <TabsList>
          <TabsTrigger value="request">New Request</TabsTrigger>
          <TabsTrigger value="submitted">Submitted Requests</TabsTrigger>
          {isAdmin && <TabsTrigger value="manage">Template Management</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="request">
          <ServiceRequest />
        </TabsContent>
        
        <TabsContent value="submitted">
          <SignedDocuments />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="manage">
            <Card>
              <TemplateManager />
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default DocumentManagement;