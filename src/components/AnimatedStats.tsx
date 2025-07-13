
import React, { useEffect, useState } from 'react';
import { TrendingUp, Target, Trophy, Calendar } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  suffix?: string;
  color: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, suffix = '', color, delay = 0 }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1500;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setAnimatedValue(value);
          clearInterval(interval);
        } else {
          setAnimatedValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="bg-card rounded-lg p-6 border hover:shadow-lg transition-all animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">
            {animatedValue.toLocaleString()}{suffix}
          </p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

interface AnimatedStatsProps {
  stats: {
    solvedProblems: number;
    maxRating: number;
    contestsParticipated: number;
    averageAttempts: number;
  };
}

export const AnimatedStats: React.FC<AnimatedStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Problems Solved"
        value={stats.solvedProblems}
        icon={<Target className="h-6 w-6 text-white" />}
        color="bg-blue-500"
        delay={0}
      />
      <StatCard
        title="Max Rating"
        value={stats.maxRating}
        icon={<TrendingUp className="h-6 w-6 text-white" />}
        color="bg-green-500"
        delay={200}
      />
      <StatCard
        title="Contests"
        value={stats.contestsParticipated}
        icon={<Trophy className="h-6 w-6 text-white" />}
        color="bg-yellow-500"
        delay={400}
      />
      <StatCard
        title="Avg Attempts"
        value={stats.averageAttempts}
        icon={<Calendar className="h-6 w-6 text-white" />}
        suffix=""
        color="bg-purple-500"
        delay={600}
      />
    </div>
  );
};
