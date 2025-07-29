import React, { useState } from 'react';
import { Search, User, Settings, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dashboard } from '@/components/Dashboard';
import { Achievements } from '@/components/Achievements';
import { DashboardCustomizer } from '@/components/DashboardCustomizer';
import { AnimatedStats } from '@/components/AnimatedStats';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AdvancedAnalytics } from '@/components/AdvancedAnalytics';
import { VirtualSubmissionList } from '@/components/VirtualSubmissionList';
import { useCodeforcesData } from '@/hooks/useCodeforcesData';
import { getRankColor } from '@/services/codeforcesApi';
import { motion } from 'framer-motion';
import { ExportData } from '@/components/ExportData';
import { UserComparison } from '@/components/UserComparison';
import { getUniqueSolvedProblems, getAverageAttempts } from '@/lib/utils';

const Index = () => {
  const [handle, setHandle] = useState('');
  const [searchHandle, setSearchHandle] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [dashboardWidgets, setDashboardWidgets] = useState([
    { id: 'stats', name: 'Statistics Overview', description: 'Key performance metrics', enabled: true, order: 1 },
    { id: 'analytics', name: 'Advanced Analytics', description: 'ML insights and predictions', enabled: true, order: 2 },
    // Add other widgets here
  ]);
  const { data, isLoading, error } = useCodeforcesData(searchHandle);

  const handleSearch = () => {
    if (handle.trim()) {
      setSearchHandle(handle);
      setShowDashboard(true);
    }
  };

  const userStats = data ? {
    solvedProblems: getUniqueSolvedProblems(data.submissions || []),
    maxRating: data.userInfo.maxRating,
    contestsParticipated: data.contests.length,
    averageAttempts: getAverageAttempts(data.submissions || []),
  } : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="absolute top-0 right-0 p-4">
        <ThemeToggle />
      </header>
      
      {!showDashboard ? (
        <main className="container mx-auto px-4 py-24 text-center animate-fade-in">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              CF<span className="text-primary">Analytix</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Unlock powerful insights from your Codeforces journey. Visualize your progress, track your stats, and predict your growth.
            </p>
            <div className="flex justify-center max-w-lg mx-auto">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter your Codeforces handle..."
                  className="w-full pl-10 pr-32 py-3 rounded-full border bg-card text-card-foreground shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
                <Button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                >
                  Analyze
                </Button>
              </div>
            </div>
          </motion.div>
        </main>
      ) : (
        <main className="container mx-auto px-4 py-16">
           {/* Your Dashboard content goes here */}
           {isLoading && <p>Loading...</p>}
           {error && <p>Error: {error.message}</p>}
           {data && userStats && (
             <div>
                {/* Example of how you might display some data */}
                <h2 className="text-3xl font-bold mb-4">Analytics for {data.userInfo.handle}</h2>
                <AnimatedStats stats={userStats} />
                <Dashboard data={data} />
             </div>
           )}
        </main>
      )}

      {/* --- FIX APPLIED HERE --- */}
      {/* This footer is added to the bottom of your main page view */}
      <footer className="text-center w-full py-6 mt-auto">
        <p className="text-sm text-muted-foreground">
          Made with ❤️ by Saurabh Jha |{' '}
          <a
            href="https://github.com/saurabhjha004/CFAnalytics"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            GitHub
          </a>
        </p>
      </footer>
      {/* --- END OF FIX --- */}
    </div>
  );
};

export default Index;
