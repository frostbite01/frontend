import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import TaskList from './components/tasks/TaskList';
import NotFound from './components/common/NotFound';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';
import UserManagement from './components/admin/UserManagement';
import AdminFormSubmissionHistory from './components/admin/AdminFormSubmissionHistory';
import { Toaster } from "./components/ui/use-toast";

// Import individual inventory list components
import AccessPointList from './components/inventory/AccessPointList';
import CctvNvrList from './components/inventory/CctvNvrList';
import LaptopList from './components/inventory/LaptopList';
import PcList from './components/inventory/PcList';
import PeripheralList from './components/inventory/PeripheralList';
import PrinterList from './components/inventory/PrinterList';
import RouterList from './components/inventory/RouterList';
import SoftwareList from './components/inventory/SoftwareList';
import SwitchList from './components/inventory/SwitchList';
import WirelessDeviceList from './components/inventory/WirelessDeviceList';
import DocumentsPage from './components/documents/DocumentsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                {/* Wrap admin-only routes */}
                <Route element={<AdminRoute />}>
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  
                  {/* Add the new admin submissions route */}
                  <Route path="admin/submissions" element={<AdminFormSubmissionHistory />} />
                  
                  <Route path="inventory">
                    <Route index element={<Navigate to="/inventory/switches" replace />} />
                    <Route path="access-points" element={<AccessPointList />} />
                    <Route path="cctv-nvr" element={<CctvNvrList />} />
                    <Route path="laptops" element={<LaptopList />} />
                    <Route path="pcs" element={<PcList />} />
                    <Route path="peripherals" element={<PeripheralList />} />
                    <Route path="printers" element={<PrinterList />} />
                    <Route path="routers" element={<RouterList />} />
                    <Route path="software" element={<SoftwareList />} />
                    <Route path="switches" element={<SwitchList />} />
                    <Route path="wireless-devices" element={<WirelessDeviceList />} />
                  </Route>
                  
                  <Route path="tasks" element={<TaskList />} />
                  <Route path="admin/users" element={<UserManagement />} />
                </Route>

                {/* Keep documents route accessible to all authenticated users */}
                <Route path="/documents" element={<DocumentsPage />} />
              </Route>
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
