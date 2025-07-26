import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const ItemSelector = ({ category, items, onSelectItem }) => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-2">Select an Item from {category}:</h3>
      <Select onValueChange={(itemId) => onSelectItem(items.find(item => item.id === itemId))}>
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Select Item" />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.name} ({item.model})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ItemSelector;