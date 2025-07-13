
import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface VirtualSubmissionListProps {
  submissions: any[];
  height?: number;
}

const SubmissionRow = ({ index, style, data }: any) => {
  const submission = data[index];
  
  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'OK': return 'bg-green-500';
      case 'WRONG_ANSWER': return 'bg-red-500';
      case 'TIME_LIMIT_EXCEEDED': return 'bg-yellow-500';
      case 'MEMORY_LIMIT_EXCEEDED': return 'bg-orange-500';
      case 'RUNTIME_ERROR': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 2400) return 'text-red-500';
    if (rating >= 2100) return 'text-orange-500';
    if (rating >= 1900) return 'text-purple-500';
    if (rating >= 1600) return 'text-blue-500';
    if (rating >= 1400) return 'text-cyan-500';
    if (rating >= 1200) return 'text-green-500';
    return 'text-gray-500';
  };

  return (
    <div style={style} className="px-2">
      <Card className="p-3 m-1">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium">
                {submission.problem.name}
              </span>
              {submission.problem.rating && (
                <Badge className={getRatingColor(submission.problem.rating)}>
                  {submission.problem.rating}
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {submission.problem.contestId}{submission.problem.index} • {submission.programmingLanguage}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getVerdictColor(submission.verdict)}>
              {submission.verdict === 'OK' ? 'AC' : submission.verdict}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(submission.creationTimeSeconds * 1000).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const VirtualSubmissionList: React.FC<VirtualSubmissionListProps> = ({ 
  submissions, 
  height = 400 
}) => {
  const sortedSubmissions = useMemo(() => 
    [...submissions].sort((a, b) => b.creationTimeSeconds - a.creationTimeSeconds),
    [submissions]
  );

  return (
    <div className="bg-card rounded-lg border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Recent Submissions ({submissions.length})</h3>
      </div>
      <List
        height={height}
        width="100%"
        itemCount={sortedSubmissions.length}
        itemSize={80}
        itemData={sortedSubmissions}
      >
        {SubmissionRow}
      </List>
    </div>
  );
};
