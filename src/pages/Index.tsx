
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


const Index = () => {
  const [handle, setHandle] = useState('');
  const [searchHandle, setSearchHandle] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [dashboardWidgets, setDashboardWidgets] = useState([
    { id: 'stats', name: 'Statistics Overview', description: 'Key performance metrics', enabled: true, order: 1 },
    { id: 'analytics', name: 'Advanced Analytics', description: 'ML insights and predictions', enabled: true, order: 2 },
    { id: 'rating', name: 'Rating Chart', description: 'Rating progression over time', enabled: true, order: 3 },
    { id: 'submissions', name: 'Submission Analysis', description: 'Problem solving patterns', enabled: true, order: 4 },
    { id: 'virtual-list', name: 'Recent Submissions', description: 'Virtual scrolling submission list', enabled: true, order: 5 },
    { id: 'contests', name: 'Contest History', description: 'Contest participation record', enabled: true, order: 6 },
    { id: 'problems', name: 'Problem Statistics', description: 'Problem difficulty breakdown', enabled: true, order: 7 },
    { id: 'comparison', name: 'User Comparison', description: 'Compare with other users', enabled: true, order: 8 },
    { id: 'achievements', name: 'Achievements', description: 'Unlocked badges and milestones', enabled: true, order: 9 },
    { id: 'export', name: 'Export Data', description: 'Export analytics to PDF', enabled: true, order: 10 }
  ]);

  const { data: userData, isLoading, error, refetch } = useCodeforcesData(searchHandle);

  const handleSearch = async () => {
    if (!handle.trim()) return;
    setSearchHandle(handle);
    setShowDashboard(true);
  };

  const enabledWidgets = dashboardWidgets.filter(w => w.enabled).sort((a, b) => a.order - b.order);

  const stats = userData?.userInfo ? {
    solvedProblems: userData.submissions.filter((s: any) => s.verdict === 'OK').length,
    maxRating: userData.userInfo.maxRating || 0,
    contestsParticipated: userData.contests.length,
    averageAttempts: userData.submissions.length > 0 ? 
      parseFloat((userData.submissions.length / userData.submissions.filter((s: any) => s.verdict === 'OK').length || 1).toFixed(1)) : 0
  } : { solvedProblems: 0, maxRating: 0, contestsParticipated: 0, averageAttempts: 0 };

  if (showDashboard && searchHandle) {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium">Fetching Codeforces data...</p>
            <p className="text-sm text-muted-foreground">This may take a few seconds</p>
          </motion.div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <motion.div 
            className="text-center max-w-md mx-auto p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
            <p className="text-muted-foreground mb-4">
              {error instanceof Error ? error.message : 'Failed to fetch user data'}
            </p>
            <div className="space-x-2">
              <Button onClick={() => refetch()}>Try Again</Button>
              <Button variant="outline" onClick={() => setShowDashboard(false)}>
                Back to Search
              </Button>
            </div>
          </motion.div>
        </div>
      );
    }

    if (!userData?.userInfo) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>No data found for handle: {searchHandle}</p>
            <Button onClick={() => setShowDashboard(false)} className="mt-4">
              Back to Search
            </Button>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <nav className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-40 dark:bg-gray-900/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowDashboard(false)}
                  className="text-primary hover:text-primary/80"
                >
                  ← Back to Search
                </Button>
                <h1 className="text-xl font-bold">CFAnalytics</h1>
              </div>
              
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowCustomizer(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center space-x-2">
                  <img 
                    src={userData.userInfo.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.userInfo.handle}`}
                    alt={userData.userInfo.handle}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="text-right">
                    <p className="text-sm font-medium">{userData.userInfo.handle}</p>
                    <p className={`text-xs capitalize ${getRankColor(userData.userInfo.rank)}`}>
                      {userData.userInfo.rank || 'unrated'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* User Info Card */}
          <motion.div 
            className="bg-card rounded-lg p-6 border mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-4">
              <img
                src={userData.userInfo.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.userInfo.handle}`}
                alt={userData.userInfo.handle}
                className="w-16 h-16 rounded-full border-2 border-primary/20"
              />
              <div>
                <h2 className="text-xl font-semibold">{userData.userInfo.handle}</h2>
                <div className="flex items-center space-x-4 mt-1">
                  <span className={`capitalize font-medium ${getRankColor(userData.userInfo.rank)}`}>
                    {userData.userInfo.rank || 'unrated'}
                  </span>
                  <span className="text-muted-foreground">
                    Rating: {userData.userInfo.rating || 'unrated'}
                  </span>
                  <span className="text-muted-foreground">
                    Max: {userData.userInfo.maxRating || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <AnimatedStats stats={stats} />

          <div className="space-y-8">
            {enabledWidgets.map((widget, index) => {
              const component = (() => {
                switch (widget.id) {
                  case 'analytics':
                    return (
                      <AdvancedAnalytics 
                        submissions={userData.submissions} 
                        contests={userData.contests}
                      />
                    );
                  case 'rating':
                    return <Dashboard data={userData} />;
                  case 'virtual-list':
                    return (
                      <VirtualSubmissionList 
                        submissions={userData.submissions}
                        height={500}
                      />
                    );
                  case 'achievements':
                    return (
                      <Achievements 
                        userStats={stats} 
                        currentRank={userData.userInfo.rank}
                        maxRank={userData.userInfo.maxRank}
                      />
                    );
                  case 'export':
                    return <ExportData userData={userData} stats={stats} />;
                  case 'comparison':
                    return <UserComparison currentUser={userData} />;
                  default:
                    return null;
                }
              })();

              return (
                <motion.div 
                  key={widget.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {component}
                </motion.div>
              );
            })}
          </div>
        </div>

        <DashboardCustomizer
          widgets={dashboardWidgets}
          onUpdateWidgets={setDashboardWidgets}
          isOpen={showCustomizer}
          onClose={() => setShowCustomizer(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-white/80 backdrop-blur-sm border-b dark:bg-gray-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-primary">CFAnalytics</h1>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <TrendingUp className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CFAnalytics
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Advanced Codeforces analytics with PDF export, user comparison, and activity heatmaps.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border max-w-md mx-auto dark:bg-gray-900/80">
              <h2 className="text-xl font-semibold mb-4">Enter Your Codeforces Handle</h2>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="your_handle"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-600"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                
                <Button 
                  onClick={handleSearch}
                  disabled={!handle.trim()}
                  className="w-full py-3 text-lg"
                >
                  Analyze Performance
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-4">Enhanced Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center dark:bg-blue-900">
                  <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-medium mb-2">ML Predictions</h4>
                <p className="text-sm text-muted-foreground">AI-powered rating predictions and problem recommendations</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center dark:bg-green-900">
                  <User className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-medium mb-2">Advanced Analytics</h4>
                <p className="text-sm text-muted-foreground">Streak tracking, language analysis, and difficulty progression</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center dark:bg-purple-900">
                  <Settings className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-medium mb-2">Performance Optimized</h4>
                <p className="text-sm text-muted-foreground">React Query caching, virtual scrolling, and smooth animations</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
