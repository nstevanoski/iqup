// Example usage of SearchableSelect component

import React, { useState } from 'react';
import { SearchableSelect, SearchableSelectOption } from './SearchableSelect';

// Example 1: Simple static options
const staticOptions: SearchableSelectOption[] = [
  {
    id: '1',
    label: 'Option 1',
    description: 'This is option 1',
    metadata: 'Category A • Type 1'
  },
  {
    id: '2',
    label: 'Option 2',
    description: 'This is option 2',
    metadata: 'Category B • Type 2'
  }
];

function StaticExample() {
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <SearchableSelect
      options={staticOptions}
      value={selectedValue}
      placeholder="Choose an option..."
      onSelect={setSelectedValue}
    />
  );
}

// Example 2: With search functionality
function SearchableExample() {
  const [selectedValue, setSelectedValue] = useState('');
  const [options, setOptions] = useState<SearchableSelectOption[]>([]);

  const handleSearch = async (searchTerm: string): Promise<SearchableSelectOption[]> => {
    // Simulate API call
    const response = await fetch(`/api/search?q=${searchTerm}`);
    const data = await response.json();
    
    return data.map((item: any) => ({
      id: item.id,
      label: item.name,
      description: item.description,
      metadata: item.category
    }));
  };

  return (
    <SearchableSelect
      options={options}
      value={selectedValue}
      placeholder="Search and select..."
      onSelect={setSelectedValue}
      onSearch={handleSearch}
      loading={false}
    />
  );
}

// Example 3: With error handling
function ErrorExample() {
  const [selectedValue, setSelectedValue] = useState('');
  const [error, setError] = useState('');

  return (
    <SearchableSelect
      options={staticOptions}
      value={selectedValue}
      placeholder="Select with error..."
      onSelect={setSelectedValue}
      error={error}
      disabled={false}
    />
  );
}

// Example 4: Custom styling
function CustomStyledExample() {
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <SearchableSelect
      options={staticOptions}
      value={selectedValue}
      placeholder="Custom styled..."
      onSelect={setSelectedValue}
      className="w-full max-w-md"
      maxHeight="max-h-48"
      showClearButton={false}
    />
  );
}
