import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const ItemChart = ({ item, locations, departments, getLocationName, getDepartmentName }) => {
  const departmentName = getDepartmentName(item.department);
  const locationName = getLocationName(item.location);

  const data = [
    { name: `Department: ${departmentName}`, value: 1 },
    { name: `Location: ${locationName}`, value: 1 },
  ];

  const COLORS = ['#0088FE', '#00C49F'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Item: {item.name} ({item.model})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
                label
              >
                {
                  data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))
                }
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemChart;