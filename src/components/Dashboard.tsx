
import React from 'react';
import { UnifiedChart } from './UnifiedChart';

interface DashboardProps {
  data: any;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <UnifiedChart data={data} />
    </div>
  );
};
