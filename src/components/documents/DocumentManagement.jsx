import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card } from '../ui/card';
import { useAuth } from '../../context/AuthContext';
import TemplateManager from './TemplateManager';
import UserTemplateView from './UserTemplateView';
import SignedDocuments from './SignedDocuments';

const DocumentManagement = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Document Management</h1>
      
      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates">
            {isAdmin ? 'Template Management' : 'Available Templates'}
          </TabsTrigger>
          <TabsTrigger value="signed">Signed Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates">
          <Card>
            {isAdmin ? <TemplateManager /> : <UserTemplateView />}
          </Card>
        </TabsContent>
        
        <TabsContent value="signed">
          <Card>
            <SignedDocuments />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentManagement;