'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface ProductFiltersProps {
  searchQuery: string;
  selectedType: string;
  sortBy: string;
  onSearchChange: (query: string) => void;
  onTypeChange: (type: string) => void;
  onSortChange: (sort: string) => void;
  onReset: () => void;
}

const teaTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'green', label: 'Green Tea' },
  { value: 'black', label: 'Black Tea' },
  { value: 'oolong', label: 'Oolong Tea' },
  { value: 'white', label: 'White Tea' },
  { value: 'pu_erh', label: "Pu'erh Tea" },
  { value: 'herbal', label: 'Herbal Tea' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
];

export function ProductFilters({
  searchQuery,
  selectedType,
  sortBy,
  onSearchChange,
  onTypeChange,
  onSortChange,
  onReset,
}: ProductFiltersProps) {
  const hasActiveFilters = searchQuery || selectedType !== 'all' || sortBy !== 'newest';

  return (
    <div className="space-y-4 p-4 bg-card border border-border rounded-lg">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Search Products
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or origin..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-border"
          />
        </div>
      </div>

      {/* Type Filter */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Tea Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {teaTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button
          onClick={onReset}
          variant="outline"
          className="w-full border-border"
        >
          <X className="w-4 h-4 mr-2" />
          Reset Filters
        </Button>
      )}
    </div>
  );
}
