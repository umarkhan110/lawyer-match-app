import React from 'react';
import { Scale, Car, Users, Home } from 'lucide-react';
import type { CaseType } from '@/types';

interface CaseTypeSelectorProps {
  onSelect: (caseType: any) => void;
}

export const CaseTypeSelector: React.FC<CaseTypeSelectorProps> = ({ onSelect }) => {
  const caseTypes: CaseType[] = [
    {
      type: 'PERSONAL_INJURY',
      title: 'Personal Injury',
      description: 'Auto accidents, slip and fall, workplace injuries',
      Icon: Car,
    },
    {
      type: 'IMMIGRATION',
      title: 'Immigration',
      description: 'Visas, citizenship, deportation defense',
      Icon: Users,
    },
    {
      type: 'CRIMINAL_DEFENSE',
      title: 'Criminal Defense',
      description: 'DUI, theft, assault, federal crimes',
      Icon: Scale,
    },
    {
      type: 'FAMILY_LAW',
      title: 'Family Law',
      description: 'Divorce, custody, adoption, support',
      Icon: Home,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {caseTypes.map(({ type, title, description, Icon }) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all hover:border-blue-500 border-2 border-transparent text-left"
          aria-label={`Select ${title} case type`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Icon />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="mt-1 text-gray-600">{description}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
