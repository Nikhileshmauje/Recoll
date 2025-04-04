import React from 'react';
import { ResourceType, RESOURCE_TYPES } from '../utils/resourceTypes';

interface FilterChipsProps {
  selectedType: ResourceType | null;
  onTypeSelect: (type: ResourceType | null) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({ selectedType, onTypeSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onTypeSelect(null)}
        className={`
          px-4 py-2 rounded-full text-sm font-medium transition-all
          ${!selectedType 
            ? 'bg-gray-900 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }
        `}
      >
        All
      </button>
      {(Object.entries(RESOURCE_TYPES) as [ResourceType, typeof RESOURCE_TYPES[ResourceType]][]).map(([type, config]) => (
        <button
          key={type}
          onClick={() => onTypeSelect(type)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all
            ${selectedType === type 
              ? 'bg-gray-900 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          {config.icon} {config.label}s
        </button>
      ))}
    </div>
  );
};