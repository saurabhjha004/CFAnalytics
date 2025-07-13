import React, { useState } from 'react';
import { Users, Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCodeforcesData } from '@/hooks/useCodeforcesData';
import { getRankColor } from '@/services/codeforcesApi';
import { useToast } from '@/hooks/use-toast';

interface UserComparisonProps {
  currentUser: any;
}

export const UserComparison: React.FC<UserComparisonProps> = ({ currentUser }) => {
  const [compareHandle, setCompareHandle] = useState('');
  const [compareUsers, setCompareUsers] = useState<any[]>([]);
  const { toast } = useToast();

  const { data: compareData, isLoading, error } = useCodeforcesData(compareHandle);

  const addUserForComparison = () => {
    if (!compareHandle.trim()) return;
    
    if (compareHandle === currentUser.userInfo.handle) {
      toast({
        title: "Invalid Comparison",
        description: "You cannot compare with yourself.",
        variant: "destructive",
      });
      return;
    }

    if (compareUsers.some(user => user.userInfo.handle === compareHandle)) {
      toast({
        title: "User Already Added",
        description: "This user is already in the comparison list.",
        variant: "destructive",
      });
      return;
    }

    if (compareData?.userInfo && !error) {
      const userStats = {
        ...compareData,
        stats: {
          solvedProblems: compareData.submissions.filter((s: any) => s.verdict === 'OK').length,
          maxRating: compareData.userInfo.maxRating || 0,
          contestsParticipated: compareData.contests.length,
          averageAttempts: compareData.submissions.length > 0 ? 
            parseFloat((compareData.submissions.length / compareData.submissions.filter((s: any) => s.verdict === 'OK').length || 1).toFixed(1)) : 0
        }
      };
      
      setCompareUsers([...compareUsers, userStats]);
      setCompareHandle('');
      
      toast({
        title: "User Added",
        description: `${compareData.userInfo.handle} has been added to comparison.`,
      });
    }
  };

  const removeUser = (handle: string) => {
    setCompareUsers(compareUsers.filter(user => user.userInfo.handle !== handle));
  };

  const currentStats = {
    solvedProblems: currentUser.submissions.filter((s: any) => s.verdict === 'OK').length,
    maxRating: currentUser.userInfo.maxRating || 0,
    contestsParticipated: currentUser.contests.length,
    averageAttempts: currentUser.submissions.length > 0 ? 
      parseFloat((currentUser.submissions.length / currentUser.submissions.filter((s: any) => s.verdict === 'OK').length || 1).toFixed(1)) : 0
  };

  const getComparisonIcon = (current: number, other: number) => {
    if (current > other) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (current < other) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          User Comparison
        </CardTitle>
        <CardDescription>
          Compare your performance with other Codeforces users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Add User Section */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter Codeforces handle to compare"
              value={compareHandle}
              onChange={(e) => setCompareHandle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addUserForComparison()}
            />
            <Button 
              onClick={addUserForComparison}
              disabled={!compareHandle.trim() || isLoading}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {error && compareHandle && (
            <div className="text-sm text-red-500">
              User "{compareHandle}" not found or error loading data.
            </div>
          )}

          {/* Current User Card */}
          <div className="border rounded-lg p-4 bg-primary/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.userInfo.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.userInfo.handle}`}
                  alt={currentUser.userInfo.handle}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-medium">{currentUser.userInfo.handle}</h4>
                  <span className={`text-sm capitalize ${getRankColor(currentUser.userInfo.rank)}`}>
                    {currentUser.userInfo.rank || 'unrated'}
                  </span>
                </div>
              </div>
              <Badge variant="default">You</Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Problems Solved</div>
                <div className="font-medium">{currentStats.solvedProblems}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Max Rating</div>
                <div className="font-medium">{currentStats.maxRating}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Contests</div>
                <div className="font-medium">{currentStats.contestsParticipated}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Avg Attempts</div>
                <div className="font-medium">{currentStats.averageAttempts}</div>
              </div>
            </div>
          </div>

          {/* Comparison Users */}
          {compareUsers.map((user) => (
            <div key={user.userInfo.handle} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={user.userInfo.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.userInfo.handle}`}
                    alt={user.userInfo.handle}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-medium">{user.userInfo.handle}</h4>
                    <span className={`text-sm capitalize ${getRankColor(user.userInfo.rank)}`}>
                      {user.userInfo.rank || 'unrated'}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeUser(user.userInfo.handle)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground flex items-center gap-1">
                    Problems Solved
                    {getComparisonIcon(currentStats.solvedProblems, user.stats.solvedProblems)}
                  </div>
                  <div className="font-medium">{user.stats.solvedProblems}</div>
                </div>
                <div>
                  <div className="text-muted-foreground flex items-center gap-1">
                    Max Rating
                    {getComparisonIcon(currentStats.maxRating, user.stats.maxRating)}
                  </div>
                  <div className="font-medium">{user.stats.maxRating}</div>
                </div>
                <div>
                  <div className="text-muted-foreground flex items-center gap-1">
                    Contests
                    {getComparisonIcon(currentStats.contestsParticipated, user.stats.contestsParticipated)}
                  </div>
                  <div className="font-medium">{user.stats.contestsParticipated}</div>
                </div>
                <div>
                  <div className="text-muted-foreground flex items-center gap-1">
                    Avg Attempts
                    {getComparisonIcon(user.stats.averageAttempts, currentStats.averageAttempts)}
                  </div>
                  <div className="font-medium">{user.stats.averageAttempts}</div>
                </div>
              </div>
            </div>
          ))}

          {compareUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No users added for comparison yet.</p>
              <p className="text-sm">Enter a Codeforces handle above to get started.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};