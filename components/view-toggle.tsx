'use client';

import { Button } from '@/components/ui/button';
import { Grid3x3, Table2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ViewToggleProps {
  currentView: 'grid' | 'table';
  onViewChange: (view: 'grid' | 'table') => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex gap-2 border border-gray-200 rounded-lg p-1 bg-white">
      <Button
        variant={currentView === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        className={cn('gap-2', currentView === 'grid' && 'bg-gray-900 text-white')}
      >
        <Grid3x3 className="w-4 h-4" />
        Grid
      </Button>
      <Button
        variant={currentView === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('table')}
        className={cn('gap-2', currentView === 'table' && 'bg-gray-900 text-white')}
      >
        <Table2 className="w-4 h-4" />
        Table
      </Button>
    </div>
  );
}
