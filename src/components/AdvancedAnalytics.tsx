
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Clock, Award } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

interface Submission {
  verdict?: string;
  creationTimeSeconds: number;
  problem: {
    rating?: number;
    name: string;
  };
  programmingLanguage: string;
}

interface Contest {
  newRating: number;
  oldRating: number;
}

interface AdvancedAnalyticsProps {
  submissions: Submission[];
  contests: Contest[];
}

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ submissions, contests }) => {
  // Calculate streak
  const calculateSolveStreak = () => {
    const acceptedSubmissions = submissions
      .filter(s => s.verdict === 'OK')
      .sort((a, b) => b.creationTimeSeconds - a.creationTimeSeconds);
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const submission of acceptedSubmissions) {
      const submissionDate = new Date(submission.creationTimeSeconds * 1000);
      submissionDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((currentDate.getTime() - submissionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
        currentDate = submissionDate;
      } else if (daysDiff > streak) {
        break;
      }
    }
    
    return streak;
  };

  // Predict next rating
  const predictNextRating = () => {
    if (contests.length < 3) return null;
    
    const recentContests = contests.slice(-5);
    const ratingChanges = recentContests.map(c => c.newRating - c.oldRating);
    const avgChange = ratingChanges.reduce((a, b) => a + b, 0) / ratingChanges.length;
    const currentRating = contests[contests.length - 1]?.newRating || 0;
    
    return Math.round(currentRating + avgChange);
  };

  // Language analysis
  const getLanguageStats = () => {
    const languageCount = submissions.reduce((acc, submission) => {
      if (submission.verdict === 'OK') {
        const lang = submission.programmingLanguage;
        acc[lang] = (acc[lang] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(languageCount)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3);
  };

  // Problem difficulty progression
  const getDifficultyProgression = () => {
    const solvedProblems = submissions
      .filter(s => s.verdict === 'OK' && s.problem.rating)
      .sort((a, b) => a.creationTimeSeconds - b.creationTimeSeconds);

    const progression = solvedProblems.reduce((acc, submission) => {
      const rating = submission.problem.rating;
      const date = new Date(submission.creationTimeSeconds * 1000).toISOString().split('T')[0];
      
      if (!acc[date] || rating > acc[date]) {
        acc[date] = rating;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(progression).slice(-10);
  };

  const streak = calculateSolveStreak();
  const predictedRating = predictNextRating();
  const topLanguages = getLanguageStats();
  const difficultyProgression = getDifficultyProgression();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Current Streak</h3>
            </div>
            <p className="text-2xl font-bold text-primary">{streak} days</p>
            <p className="text-sm text-muted-foreground">Daily solving streak</p>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold">Predicted Rating</h3>
            </div>
            <p className="text-2xl font-bold text-green-500">
              {predictedRating ? `~${predictedRating}` : 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground">Next contest prediction</p>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">Peak Difficulty</h3>
            </div>
            <p className="text-2xl font-bold text-blue-500">
              {Math.max(...submissions.filter(s => s.verdict === 'OK' && s.problem.rating).map(s => s.problem.rating || 0)) || 0}
            </p>
            <p className="text-sm text-muted-foreground">Highest solved rating</p>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold">Top Language</h3>
            </div>
            <p className="text-lg font-bold text-purple-500">
              {topLanguages[0]?.[0]?.split(' ')[0] || 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground">
              {topLanguages[0]?.[1] || 0} problems solved
            </p>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Language Distribution</h3>
          <div className="space-y-2">
            {topLanguages.map(([language, count], index) => (
              <div key={language} className="flex items-center justify-between">
                <span className="text-sm">{language}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{count} problems</Badge>
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${((count as number) / (topLanguages[0][1] as number)) * 100}%` 
                      }}
                      transition={{ delay: index * 0.2, duration: 0.8 }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Difficulty Progression</h3>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground mb-3">
              Your highest solved problem rating over time (last 10 entries)
            </div>
            {difficultyProgression.map(([date, rating], index) => (
              <motion.div
                key={date}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-sm">{date}</span>
                <Badge className={`
                  ${(rating as number) >= 2400 ? 'bg-red-500' : 
                    (rating as number) >= 2100 ? 'bg-orange-500' : 
                    (rating as number) >= 1900 ? 'bg-purple-500' : 
                    (rating as number) >= 1600 ? 'bg-blue-500' : 
                    (rating as number) >= 1400 ? 'bg-cyan-500' : 
                    (rating as number) >= 1200 ? 'bg-green-500' : 'bg-gray-500'}
                `}>
                  {rating as number}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
