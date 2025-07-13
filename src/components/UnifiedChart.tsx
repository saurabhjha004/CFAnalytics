import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';

interface UnifiedChartProps {
  data: {
    contests?: any[];
    submissions?: any[];
  };
}

type DataType = 'rating' | 'submissions' | 'problems';
type ChartType = 'line' | 'bar' | 'area' | 'pie';

const chartVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3 }
  }
} as const;

const VERDICT_COLORS = {
  'Accepted': 'hsl(142 76% 36%)', // Green for AC
  'Wrong answer': 'hsl(0 84% 60%)', // Red for WA
  'Time limit exceeded': 'hsl(38 92% 50%)', // Orange for TLE
  'Memory limit exceeded': 'hsl(262 83% 58%)', // Purple for MLE
  'Runtime error': 'hsl(346 87% 43%)', // Dark red for RE
  'Compilation error': 'hsl(24 100% 50%)', // Orange for CE
  'In Queue': 'hsl(var(--muted-foreground))',
  'default': 'hsl(var(--primary))'
};

const DIFFICULTY_COLORS = ['hsl(142 76% 36%)', 'hsl(46 100% 56%)', 'hsl(38 92% 50%)', 'hsl(0 84% 60%)', 'hsl(346 87% 43%)'];

export const UnifiedChart: React.FC<UnifiedChartProps> = ({ data }) => {
  const [dataType, setDataType] = useState<DataType>('rating');
  const [chartType, setChartType] = useState<ChartType>(() => {
    switch (dataType) {
      case 'rating': return 'line';
      case 'submissions': return 'bar';
      case 'problems': return 'pie';
      default: return 'line';
    }
  });

  // Update chart type when data type changes
  React.useEffect(() => {
    switch (dataType) {
      case 'rating': setChartType('line'); break;
      case 'submissions': setChartType('bar'); break;
      case 'problems': setChartType('pie'); break;
    }
  }, [dataType]);

  const getCurrentData = () => {
    switch (dataType) {
      case 'rating':
        return data.contests || [];
      case 'submissions':
        return data.submissions || [];
      case 'problems':
        return data.submissions || [];
      default:
        return [];
    }
  };

  const getChartData = () => {
    const currentData = getCurrentData();
    
    switch (dataType) {
      case 'rating':
        return currentData.map((contest, index) => ({
          contest: index + 1,
          rating: contest.newRating,
          name: `Contest ${contest.contestId}`,
          date: new Date(contest.ratingUpdateTimeSeconds * 1000).toLocaleDateString(),
          change: index > 0 ? contest.newRating - currentData[index - 1].newRating : 0
        }));
      
      case 'submissions':
        const verdictCounts = currentData.reduce((acc, submission) => {
          const verdict = submission.verdict === 'OK' ? 'Accepted' : (submission.verdict || 'In Queue');
          acc[verdict] = (acc[verdict] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        return Object.entries(verdictCounts).map(([verdict, count]) => ({
          verdict,
          count,
          color: VERDICT_COLORS[verdict as keyof typeof VERDICT_COLORS] || VERDICT_COLORS.default
        }));
      
      case 'problems':
        const ratingDistribution = currentData.reduce((acc, submission) => {
          if (submission.verdict === 'OK') {
            const rating = submission.problem?.rating || 800;
            const range = Math.floor(rating / 200) * 200;
            const rangeKey = `${range}-${range + 199}`;
            acc[rangeKey] = (acc[rangeKey] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);
        
        // Sort by rating range
        return Object.entries(ratingDistribution)
          .sort(([a], [b]) => parseInt(a.split('-')[0]) - parseInt(b.split('-')[0]))
          .map(([range, count], index) => ({
            range,
            count,
            name: range,
            color: DIFFICULTY_COLORS[index % DIFFICULTY_COLORS.length]
          }));
      
      default:
        return [];
    }
  };

  const chartData = getChartData();
  
  
  const getTitle = () => {
    switch (dataType) {
      case 'rating': return 'Rating Progress';
      case 'submissions': return 'Submission Analysis';
      case 'problems': return 'Problem Difficulty Distribution';
      default: return 'Data Visualization';
    }
  };

  const getAvailableChartTypes = (): ChartType[] => {
    switch (dataType) {
      case 'rating': return ['line', 'bar'];
      case 'submissions': return ['bar'];
      case 'problems': return ['pie', 'bar'];
      default: return ['line', 'bar', 'area', 'pie'];
    }
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey={dataType === 'rating' ? 'contest' : 'name'} 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey={dataType === 'rating' ? 'rating' : 'count'} 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey={dataType === 'rating' ? 'contest' : 'name'} 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey={dataType === 'rating' ? 'rating' : 'count'} 
              stroke="hsl(var(--primary))" 
              fill="hsl(var(--primary))"
              fillOpacity={0.1}
              strokeWidth={3}
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey={dataType === 'submissions' ? 'verdict' : dataType === 'problems' ? 'range' : 'contest'} 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              angle={dataType === 'submissions' ? -45 : 0}
              textAnchor={dataType === 'submissions' ? 'end' : 'middle'}
              height={dataType === 'submissions' ? 60 : 30}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Bar 
              dataKey={dataType === 'rating' ? 'rating' : 'count'} 
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || 'hsl(var(--primary))'}
                />
              ))}
            </Bar>
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, count, percent }) => `${name}: ${count} (${(percent * 100).toFixed(1)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || DIFFICULTY_COLORS[index % DIFFICULTY_COLORS.length]} />
              ))}
            </Pie>
            <Legend 
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '12px'
              }}
              formatter={(value, entry: any) => (
                <span style={{ color: entry.color }}>
                  {dataType === 'submissions' ? value : `${value} rating`}
                </span>
              )}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
          </PieChart>
        );

      default:
        return null;
    }
  };

  // Add data type buttons
  const dataTypeButtons = [
    { type: 'rating' as DataType, label: 'Rating Progress', icon: TrendingUp },
    { type: 'submissions' as DataType, label: 'Submissions', icon: BarChart3 },
    { type: 'problems' as DataType, label: 'Problems', icon: PieChartIcon },
  ];

  const getChartIcon = () => {
    switch (chartType) {
      case 'line': return <TrendingUp className="h-4 w-4" />;
      case 'bar': return <BarChart3 className="h-4 w-4" />;
      case 'area': return <Activity className="h-4 w-4" />;
      case 'pie': return <PieChartIcon className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };


  return (
    <motion.div 
      className="relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 ring-1 ring-primary/20">
              {getChartIcon()}
            </div>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              {getTitle()}
            </h3>
          </div>
          <div className="flex gap-2">
            <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
              {dataTypeButtons.map((btn) => (
                <button
                  key={btn.type}
                  onClick={() => setDataType(btn.type)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                    dataType === btn.type
                      ? 'bg-card text-card-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                  }`}
                >
                  <btn.icon className="h-4 w-4" />
                  {btn.label}
                </button>
              ))}
            </div>
            <Select value={chartType} onValueChange={(value) => setChartType(value as ChartType)}>
              <SelectTrigger className="w-32 h-9 bg-card/50 border-border/50 backdrop-blur">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getAvailableChartTypes().map((type) => (
                  <SelectItem key={type} value={type} className="capitalize">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={chartType}
            className="h-80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};