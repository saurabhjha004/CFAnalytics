
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Target, TrendingUp, Award, Zap } from 'lucide-react';

interface AchievementsProps {
  userStats: {
    solvedProblems: number;
    maxRating: number;
    contestsParticipated: number;
    averageAttempts: number;
  };
  currentRank?: string;
  maxRank?: string;
}

const cfRankAchievements = [
  { rank: 'pupil', minRating: 1200, color: 'bg-green-100 text-green-800', icon: Star },
  { rank: 'specialist', minRating: 1400, color: 'bg-cyan-100 text-cyan-800', icon: Target },
  { rank: 'expert', minRating: 1600, color: 'bg-blue-100 text-blue-800', icon: TrendingUp },
  { rank: 'candidate master', minRating: 1900, color: 'bg-purple-100 text-purple-800', icon: Award },
  { rank: 'master', minRating: 2100, color: 'bg-orange-100 text-orange-800', icon: Trophy },
  { rank: 'international master', minRating: 2300, color: 'bg-orange-100 text-orange-800', icon: Trophy },
  { rank: 'grandmaster', minRating: 2400, color: 'bg-red-100 text-red-800', icon: Zap },
  { rank: 'international grandmaster', minRating: 2600, color: 'bg-red-100 text-red-800', icon: Zap },
  { rank: 'legendary grandmaster', minRating: 3000, color: 'bg-red-100 text-red-800', icon: Zap }
];

const problemSolvingAchievements = [
  { name: 'First Steps', description: 'Solved 10 problems', threshold: 10, icon: Star },
  { name: 'Getting Started', description: 'Solved 50 problems', threshold: 50, icon: Target },
  { name: 'Problem Solver', description: 'Solved 100 problems', threshold: 100, icon: TrendingUp },
  { name: 'Dedicated Coder', description: 'Solved 250 problems', threshold: 250, icon: Award },
  { name: 'Programming Master', description: 'Solved 500 problems', threshold: 500, icon: Trophy },
  { name: 'Elite Solver', description: 'Solved 1000 problems', threshold: 1000, icon: Zap }
];

const contestAchievements = [
  { name: 'Contest Rookie', description: 'Participated in 5 contests', threshold: 5, icon: Star },
  { name: 'Regular Participant', description: 'Participated in 20 contests', threshold: 20, icon: Target },
  { name: 'Contest Veteran', description: 'Participated in 50 contests', threshold: 50, icon: Award },
  { name: 'Competition Master', description: 'Participated in 100 contests', threshold: 100, icon: Trophy }
];

export const Achievements: React.FC<AchievementsProps> = ({ 
  userStats, 
  currentRank = 'unrated',
  maxRank = 'unrated'
}) => {
  const getUnlockedRankAchievements = () => {
    return cfRankAchievements.filter(achievement => 
      userStats.maxRating >= achievement.minRating
    );
  };

  const getUnlockedProblemAchievements = () => {
    return problemSolvingAchievements.filter(achievement =>
      userStats.solvedProblems >= achievement.threshold
    );
  };

  const getUnlockedContestAchievements = () => {
    return contestAchievements.filter(achievement =>
      userStats.contestsParticipated >= achievement.threshold
    );
  };

  const allUnlockedAchievements = [
    ...getUnlockedRankAchievements(),
    ...getUnlockedProblemAchievements(),
    ...getUnlockedContestAchievements()
  ];

  return (
    <div className="bg-card rounded-lg p-6 border animate-fade-in">
      <div className="flex items-center space-x-2 mb-6">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <h2 className="text-xl font-semibold">Achievements</h2>
        <Badge variant="secondary">{allUnlockedAchievements.length}</Badge>
      </div>

      {/* Current and Max Rank Display */}
      <div className="mb-6 p-4 bg-muted/50 rounded-lg">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Codeforces Ranks</h3>
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-xs text-muted-foreground">Current Rank</p>
            <Badge className="capitalize">{currentRank}</Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Max Rank</p>
            <Badge variant="outline" className="capitalize">{maxRank}</Badge>
          </div>
        </div>
      </div>

      {/* Rank Achievements */}
      {getUnlockedRankAchievements().length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Rank Achievements</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {getUnlockedRankAchievements().map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className={`p-2 rounded-full ${achievement.color}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium capitalize">{achievement.rank}</p>
                    <p className="text-xs text-muted-foreground">Rating: {achievement.minRating}+</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Problem Solving Achievements */}
      {getUnlockedProblemAchievements().length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Problem Solving</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {getUnlockedProblemAchievements().map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Contest Achievements */}
      {getUnlockedContestAchievements().length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Contest Participation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {getUnlockedContestAchievements().map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className="p-2 rounded-full bg-green-100 text-green-600">
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {allUnlockedAchievements.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Start solving problems to unlock achievements!</p>
        </div>
      )}
    </div>
  );
};
