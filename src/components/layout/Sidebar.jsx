import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Router, 
  X, 
  Home, 
  Package, 
  Monitor, 
  Printer, 
  Laptop, 
  HardDrive, 
  Box, 
  Camera, 
  Wifi, 
  Radio, 
  Users, 
  ChevronDown, 
  ChevronRight,
  LogOut,
  LayoutDashboard,
  CheckSquare
} from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { NavLink } from 'react-router-dom';
import { categoryConfigs } from '../../config/categoryConfigs';

const Sidebar = ({ sidebarOpen, closeSidebar, mobile, onLinkClick }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [inventoryOpen, setInventoryOpen] = React.useState(true);
  const isAdmin = currentUser?.role === 'admin';

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleClick = () => {
    if (mobile && onLinkClick) {
      onLinkClick();
    }
  };

  const NavItem = ({ to, icon: Icon, children, end = false, color }) => (
    <NavLink
      to={to}
      end={end}
      onClick={handleClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
          isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
          color // Add the color to the className
        )
      }
    >
      <Icon className="h-4 w-4 mr-2" /> {/* Add the icon before the text */}
      <span>{children}</span>
    </NavLink>
  );

  return (
    <motion.aside
      className={`fixed inset-y-0 left-0 z-50 w-64 flex-shrink-0 transform flex-col bg-card shadow-lg transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      initial={false}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center space-x-2" onClick={closeSidebar}>
          <img src="/logoppa.png" alt="Logo" className="h-8 w-auto" />
          <span className="text-xl font-bold">ICT Hub</span>
        </Link>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={closeSidebar}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          <NavItem to="/" icon={LayoutDashboard} end>
            Dashboard
          </NavItem>

          <div className="pt-4">
            <button
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={() => setInventoryOpen(!inventoryOpen)}
            >
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Inventory</span>
              </div>
              {inventoryOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            {inventoryOpen && (
              <div className="mt-1 space-y-1 pl-6">
                {Object.entries(categoryConfigs).map(([key, config]) => (
                  <NavItem key={key} to={`/inventory/${key}`} icon={config.icon} color={config.color}>
                    {config.title}
                  </NavItem>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4">
            <h4 className="mb-1 px-2 text-xs font-semibold text-muted-foreground">
              Tasks
            </h4>
            <NavItem to="/tasks" icon={CheckSquare}>
              Task Management
            </NavItem>
          </div>

          {isAdmin && (
            <div className="pt-4">
              <h4 className="mb-1 px-2 text-xs font-semibold text-muted-foreground">
                Administration
              </h4>
              <NavItem to="/admin/users" icon={Users}>
                User Management
              </NavItem>
            </div>
          )}
        </nav>
      </div>

      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={currentUser?.avatarUrl} alt={currentUser?.username} />
              <AvatarFallback>
                {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{currentUser?.username || 'User'}</p>
              <p className="text-xs text-muted-foreground">{currentUser?.role || 'user'}</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="h-5 w-5 text-muted-foreground hover:text-primary" />
          </Button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;