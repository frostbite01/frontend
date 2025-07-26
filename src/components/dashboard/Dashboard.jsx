import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../ui/use-toast';
import { getCategories, getItems } from '../../api/inventory';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import * as XLSX from 'xlsx';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);

      const fetchedItems = await getItems('laptops');
      setItems(JSON.stringify(fetchedItems));
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data.');
      toast({
        title: 'Error fetching data',
        description: err.message || 'Failed to fetch data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);

    setLoading(true);
    try {
      const fetchedItems = await getItems(category);
      setItems(JSON.stringify(fetchedItems));
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to load items.');
      toast({
        title: 'Error fetching items',
        description: err.message || 'Failed to fetch items',
        variant: 'destructive'
      });
      setItems(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">Error: {error}</div>;
  }

  const filteredItems = items ? JSON.parse(items).filter(item => 
    selectedDepartment === 'all' || 
    (item.departmentInfo && item.departmentInfo.department === selectedDepartment)
  ) : [];

  const departments = items ? [...new Set(JSON.parse(items)
    .filter(item => item.departmentInfo)
    .map(item => item.departmentInfo.department))] : [];

  const generateChartData = (items) => {
    const departmentCounts = items.reduce((acc, item) => {
      const dept = item.departmentInfo?.department || 'Unassigned';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(departmentCounts),
      datasets: [{
        data: Object.values(departmentCounts),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
      }]
    };
  };

  const handleExportExcel = () => {
    if (!filteredItems.length) return;

    const worksheet = XLSX.utils.json_to_sheet(filteredItems.map(item => ({
      Category: selectedCategory,
      Name: item.name,
      'Asset ID': item.asset_id,
      Department: item.departmentInfo?.department || 'Unassigned',
      Location: item.locationInfo?.location || 'Unassigned',
      Status: item.status
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');
    XLSX.writeFile(workbook, `inventory_${selectedCategory}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Dashboard</CardTitle>
            <CardDescription>
              Manage and view your inventory statistics
            </CardDescription>
          </div>
          <Button 
            onClick={handleExportExcel}
            disabled={!filteredItems.length}
          >
            Export to Excel
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Category Selection */}
            <div>
              <label className="text-sm font-medium">Select Category:</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Department Filter */}
            <div>
              <label className="text-sm font-medium">Filter by Department:</label>
              <Select 
                value={selectedDepartment} 
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger className="w-full md:w-64 mt-2">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Chart Card */}
        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredItems.length > 0 && (
              <div className="w-full max-w-md mx-auto">
                <Pie 
                  data={generateChartData(filteredItems)}
                  options={{
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Table Card */}
        <Card>
          <CardHeader>
            <CardTitle>Items Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.departmentInfo?.department || '-'}</TableCell>
                    <TableCell>{item.locationInfo?.location || '-'}</TableCell>
                    <TableCell>{item.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;