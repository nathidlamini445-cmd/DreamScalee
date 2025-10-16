'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import HypeMeter from '@/components/hypeos/hype-meter';
import DailyFocusCard from '@/components/hypeos/daily-focus-card';
import MiniWins from '@/components/hypeos/mini-wins';
import StreakTracker from '@/components/hypeos/streak-tracker';
import DailyQuests from '@/components/hypeos/daily-quests';
import StreakCelebration from '@/components/hypeos/streak-celebration';
import { HorizontalNav } from '@/components/horizontal-nav';
import { 
  Quest, 
  updateQuestProgress, 
  checkQuestCompletions, 
  saveQuestProgress,
  calculateQuestProgress,
  initializeQuests
} from '@/lib/hypeos/quest-system';
import { 
  updateStreak, 
  getStreakMultiplier,
  getStreakLevel,
  type StreakData 
} from '@/lib/hypeos/streak-calculator';
import { 
  Flame, 
  Star, 
  Target, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Zap,
  Trophy,
  Users,
  Calendar,
  Gift,
  BarChart3,
  ArrowRight,
  Sparkles,
  DollarSign,
  User,
  Rocket,
  TrendingUp as TrendingUpIcon,
  BookOpen,
  Building,
  Dumbbell,
  Palette,
  GraduationCap,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface User {
  name: string;
  level: number;
  hypePoints: number;
  currentStreak: number;
  longestStreak: number;
  goalProgress: number;
  goalTitle: string;
  goalTarget: string;
  goalCurrent: string;
  category: string;
  hasCompletedOnboarding: boolean;
}

interface Task {
  id: number;
  title: string;
  completed: boolean;
  points: number;
  impact: 'high' | 'medium' | 'low';
  category?: string;
  estimatedTime?: string;
}

interface MiniWin {
  id: number;
  title: string;
  completed: boolean;
  points: number;
  time: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export default function HypeOSPage() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [miniWins, setMiniWins] = useState<MiniWin[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [viewMode, setViewMode] = useState<'default' | 'quests'>('default');
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [weeklyProgress, setWeeklyProgress] = useState<number[]>([1, 1, 1, 1, 1, 1, 1]);

  // Generate initial tasks based on user's goal and category
  const generateInitialTasks = (userData: User) => {
    // Generate niche-specific tasks based on category and goal
    const getNicheSpecificTasks = (category: string, goalTitle: string) => {
      const baseTasks = {
        revenue: [
          { title: `Research revenue streams for ${goalTitle.toLowerCase()}`, points: 200, impact: 'high' as const, category: 'research', time: '45 min' },
          { title: 'Analyze your current income sources', points: 150, impact: 'medium' as const, category: 'analysis', time: '30 min' },
          { title: 'Create pricing strategy for your offerings', points: 250, impact: 'high' as const, category: 'strategy', time: '60 min' },
          { title: 'Set up payment and invoicing systems', points: 100, impact: 'low' as const, category: 'setup', time: '20 min' }
        ],
        audience: [
          { title: `Define your target audience for ${goalTitle.toLowerCase()}`, points: 200, impact: 'high' as const, category: 'research', time: '45 min' },
          { title: 'Audit your current social media presence', points: 150, impact: 'medium' as const, category: 'analysis', time: '30 min' },
          { title: 'Create content calendar for next 30 days', points: 250, impact: 'high' as const, category: 'planning', time: '60 min' },
          { title: 'Set up analytics tracking for growth metrics', points: 100, impact: 'low' as const, category: 'setup', time: '20 min' }
        ],
        product: [
          { title: `Conduct market research for ${goalTitle.toLowerCase()}`, points: 200, impact: 'high' as const, category: 'research', time: '45 min' },
          { title: 'Create product roadmap and timeline', points: 250, impact: 'high' as const, category: 'planning', time: '60 min' },
          { title: 'Develop MVP (Minimum Viable Product) features', points: 300, impact: 'high' as const, category: 'development', time: '90 min' },
          { title: 'Set up product testing and feedback system', points: 150, impact: 'medium' as const, category: 'setup', time: '30 min' }
        ],
        marketing: [
          { title: `Create marketing strategy for ${goalTitle.toLowerCase()}`, points: 250, impact: 'high' as const, category: 'strategy', time: '60 min' },
          { title: 'Design marketing materials and assets', points: 200, impact: 'medium' as const, category: 'creative', time: '45 min' },
          { title: 'Set up social media advertising campaigns', points: 200, impact: 'medium' as const, category: 'execution', time: '45 min' },
          { title: 'Track and analyze campaign performance', points: 150, impact: 'medium' as const, category: 'analysis', time: '30 min' }
        ],
        content: [
          { title: `Develop content strategy for ${goalTitle.toLowerCase()}`, points: 200, impact: 'high' as const, category: 'strategy', time: '45 min' },
          { title: 'Create content calendar and themes', points: 150, impact: 'medium' as const, category: 'planning', time: '30 min' },
          { title: 'Produce first batch of content pieces', points: 300, impact: 'high' as const, category: 'creation', time: '90 min' },
          { title: 'Set up content distribution channels', points: 100, impact: 'low' as const, category: 'setup', time: '20 min' }
        ],
        business: [
          { title: `Create business growth plan for ${goalTitle.toLowerCase()}`, points: 250, impact: 'high' as const, category: 'strategy', time: '60 min' },
          { title: 'Analyze current business operations', points: 200, impact: 'medium' as const, category: 'analysis', time: '45 min' },
          { title: 'Identify growth opportunities and partnerships', points: 200, impact: 'medium' as const, category: 'research', time: '45 min' },
          { title: 'Set up systems for scaling operations', points: 150, impact: 'medium' as const, category: 'setup', time: '30 min' }
        ],
        skills: [
          { title: `Identify key skills needed for ${goalTitle.toLowerCase()}`, points: 150, impact: 'medium' as const, category: 'research', time: '30 min' },
          { title: 'Create learning roadmap and schedule', points: 200, impact: 'high' as const, category: 'planning', time: '45 min' },
          { title: 'Enroll in relevant courses or training', points: 100, impact: 'low' as const, category: 'action', time: '20 min' },
          { title: 'Practice and apply new skills daily', points: 250, impact: 'high' as const, category: 'practice', time: '60 min' }
        ],
        creative: [
          { title: `Brainstorm creative concepts for ${goalTitle.toLowerCase()}`, points: 200, impact: 'high' as const, category: 'ideation', time: '45 min' },
          { title: 'Create mood boards and inspiration collection', points: 150, impact: 'medium' as const, category: 'research', time: '30 min' },
          { title: 'Start working on your creative project', points: 300, impact: 'high' as const, category: 'creation', time: '90 min' },
          { title: 'Share work and gather feedback', points: 100, impact: 'low' as const, category: 'sharing', time: '20 min' }
        ],
        learning: [
          { title: `Research best resources for ${goalTitle.toLowerCase()}`, points: 150, impact: 'medium' as const, category: 'research', time: '30 min' },
          { title: 'Create study schedule and milestones', points: 200, impact: 'high' as const, category: 'planning', time: '45 min' },
          { title: 'Start first learning module or course', points: 250, impact: 'high' as const, category: 'learning', time: '60 min' },
          { title: 'Take notes and create knowledge base', points: 100, impact: 'low' as const, category: 'documentation', time: '20 min' }
        ],
        fitness: [
          { title: `Create fitness plan for ${goalTitle.toLowerCase()}`, points: 200, impact: 'high' as const, category: 'planning', time: '45 min' },
          { title: 'Set up workout tracking system', points: 100, impact: 'low' as const, category: 'setup', time: '20 min' },
          { title: 'Start first workout session', points: 250, impact: 'high' as const, category: 'action', time: '60 min' },
          { title: 'Plan healthy meals for the week', points: 150, impact: 'medium' as const, category: 'planning', time: '30 min' }
        ]
      };

      return baseTasks[category as keyof typeof baseTasks] || baseTasks.revenue;
    };

    const getNicheSpecificMiniWins = (category: string) => {
      const miniWinsByCategory = {
        revenue: [
          { title: 'Research one new revenue stream idea', points: 25, time: '5 min', category: 'research', difficulty: 'easy' as const },
          { title: 'Write down your current income sources', points: 30, time: '3 min', category: 'planning', difficulty: 'easy' as const },
          { title: 'Calculate your hourly rate', points: 20, time: '2 min', category: 'analysis', difficulty: 'easy' as const }
        ],
        audience: [
          { title: 'Engage with 5 posts in your niche', points: 25, time: '5 min', category: 'engagement', difficulty: 'easy' as const },
          { title: 'Write down 3 audience pain points', points: 30, time: '3 min', category: 'research', difficulty: 'easy' as const },
          { title: 'Follow 3 new accounts in your industry', points: 15, time: '2 min', category: 'networking', difficulty: 'easy' as const }
        ],
        product: [
          { title: 'Sketch one product feature idea', points: 25, time: '5 min', category: 'ideation', difficulty: 'easy' as const },
          { title: 'Write down 3 user problems to solve', points: 30, time: '3 min', category: 'research', difficulty: 'easy' as const },
          { title: 'Research one competitor product', points: 20, time: '2 min', category: 'analysis', difficulty: 'easy' as const }
        ],
        marketing: [
          { title: 'Create one social media post', points: 25, time: '5 min', category: 'content', difficulty: 'easy' as const },
          { title: 'Write down 3 marketing channels to try', points: 30, time: '3 min', category: 'planning', difficulty: 'easy' as const },
          { title: 'Engage with 3 posts from your target audience', points: 15, time: '2 min', category: 'engagement', difficulty: 'easy' as const }
        ],
        content: [
          { title: 'Write one social media caption', points: 25, time: '5 min', category: 'writing', difficulty: 'easy' as const },
          { title: 'Find 3 content ideas for this week', points: 30, time: '3 min', category: 'ideation', difficulty: 'easy' as const },
          { title: 'Engage with 3 posts in your niche', points: 15, time: '2 min', category: 'engagement', difficulty: 'easy' as const }
        ],
        business: [
          { title: 'Write down one business goal for this week', points: 25, time: '5 min', category: 'planning', difficulty: 'easy' as const },
          { title: 'Research one business tool or software', points: 30, time: '3 min', category: 'research', difficulty: 'easy' as const },
          { title: 'Connect with one person in your industry', points: 20, time: '2 min', category: 'networking', difficulty: 'easy' as const }
        ],
        skills: [
          { title: 'Watch one 5-minute tutorial', points: 25, time: '5 min', category: 'learning', difficulty: 'easy' as const },
          { title: 'Practice one skill for 3 minutes', points: 30, time: '3 min', category: 'practice', difficulty: 'easy' as const },
          { title: 'Write down one thing you learned today', points: 20, time: '2 min', category: 'reflection', difficulty: 'easy' as const }
        ],
        creative: [
          { title: 'Create one quick sketch or doodle', points: 25, time: '5 min', category: 'creation', difficulty: 'easy' as const },
          { title: 'Find 3 pieces of creative inspiration', points: 30, time: '3 min', category: 'research', difficulty: 'easy' as const },
          { title: 'Write down one creative idea', points: 20, time: '2 min', category: 'ideation', difficulty: 'easy' as const }
        ],
        learning: [
          { title: 'Read one educational article', points: 25, time: '5 min', category: 'reading', difficulty: 'easy' as const },
          { title: 'Take notes on one key concept', points: 30, time: '3 min', category: 'documentation', difficulty: 'easy' as const },
          { title: 'Write down one question to research', points: 20, time: '2 min', category: 'curiosity', difficulty: 'easy' as const }
        ],
        fitness: [
          { title: 'Do 10 push-ups or squats', points: 25, time: '5 min', category: 'exercise', difficulty: 'easy' as const },
          { title: 'Drink a glass of water', points: 15, time: '1 min', category: 'health', difficulty: 'easy' as const },
          { title: 'Write down one healthy meal idea', points: 20, time: '2 min', category: 'planning', difficulty: 'easy' as const }
        ]
      };

      return miniWinsByCategory[category as keyof typeof miniWinsByCategory] || miniWinsByCategory.revenue;
    };

    const nicheTasks = getNicheSpecificTasks(userData.category || 'revenue', userData.goalTitle);
    const initialTasks: Task[] = nicheTasks.map((task, index) => ({
      id: index + 1,
      title: task.title,
      completed: false,
      points: task.points,
      impact: task.impact,
      category: task.category,
      estimatedTime: task.time
    }));

    const nicheMiniWins = getNicheSpecificMiniWins(userData.category || 'revenue');
    const initialMiniWins: MiniWin[] = nicheMiniWins.map((win, index) => ({
      id: index + 1,
      title: win.title,
      completed: false,
      points: win.points,
      time: win.time,
      category: win.category,
      difficulty: win.difficulty
    }));

    setTasks(initialTasks);
    setMiniWins(initialMiniWins);
    
    // Initialize quests
    const initialQuests = initializeQuests();
    setQuests(initialQuests);
  };

  // Check if user has completed onboarding
  useEffect(() => {
    const checkUserStatus = () => {
      // Clear any old data to ensure fresh onboarding
      const savedUser = localStorage.getItem('hypeos-user');
      console.log('Saved user data:', savedUser);
      
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          console.log('Parsed user data:', userData);
          // Check if the data is from yesterday or incomplete
          if (!userData.hasCompletedOnboarding || !userData.goalTitle || !userData.category) {
            console.log('User data incomplete, showing onboarding');
            localStorage.removeItem('hypeos-user');
            setShowOnboarding(true);
          } else {
            console.log('User data complete, loading user');
            setUser(userData);
            generateInitialTasks(userData);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('hypeos-user');
          setShowOnboarding(true);
        }
      } else {
        // First time user - show onboarding
        console.log('No saved user, showing onboarding');
        setShowOnboarding(true);
      }
      setIsLoading(false);
    };

    checkUserStatus();
  }, []);

  // Load view mode preference
  useEffect(() => {
    const savedViewMode = localStorage.getItem('hypeos-view-mode');
    if (savedViewMode === 'quests' || savedViewMode === 'default') {
      setViewMode(savedViewMode);
    }
  }, []);

  // Save view mode preference
  const handleViewModeChange = (mode: 'default' | 'quests') => {
    setViewMode(mode);
    localStorage.setItem('hypeos-view-mode', mode);
  };

  const completeTask = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: true }
        : task
    ));
    
    const task = tasks.find(t => t.id === taskId);
    if (task && user) {
      const updatedUser = {
        ...user,
        hypePoints: user.hypePoints + task.points
      };
      setUser(updatedUser);
      
      // Update quest progress
      const progress = calculateQuestProgress(tasks, updatedUser.hypePoints, user.currentStreak);
      const updatedQuests = updateQuestProgress(quests, progress);
      
      // Check for quest completions and give rewards
      const rewards = checkQuestCompletions(quests, updatedQuests);
      if (rewards.length > 0) {
        const totalRewardPoints = rewards.reduce((sum, reward) => sum + reward.points, 0);
        const finalUser = {
          ...updatedUser,
          hypePoints: updatedUser.hypePoints + totalRewardPoints
        };
        setUser(finalUser);
      }
      
      // Update quests state and save progress
      setQuests(updatedQuests);
      saveQuestProgress(updatedQuests);
      
      // Check if all tasks are completed
      const updatedTasks = tasks.map(t => 
        t.id === taskId ? { ...t, completed: true } : t
      );
      const allTasksCompleted = updatedTasks.every(t => t.completed);
      
      if (allTasksCompleted) {
        // Update streak data - increment current streak
        const streakData: StreakData = {
          currentStreak: user.currentStreak + 1, // Increment streak
          longestStreak: Math.max(user.longestStreak, user.currentStreak + 1),
          lastActiveDate: new Date(),
          streakStartDate: user.currentStreak === 0 ? new Date() : new Date(), // Reset start date if starting fresh
          totalDaysActive: user.currentStreak === 0 ? 1 : 1 // This should be tracked separately
        };
        
        const updatedStreakData = updateStreak(streakData);
        const streakMultiplier = getStreakMultiplier(updatedStreakData.currentStreak);
        
        // Update user with new streak data
        const userWithUpdatedStreak = {
          ...updatedUser,
          currentStreak: updatedStreakData.currentStreak,
          longestStreak: updatedStreakData.longestStreak
        };
        
        setUser(userWithUpdatedStreak);
        localStorage.setItem('hypeos-user', JSON.stringify(userWithUpdatedStreak));
        
        // Show streak celebration
        setShowStreakCelebration(true);
      }
    }
  };

  const completeMiniWin = (miniWinId: number) => {
    setMiniWins(miniWins.map(win => 
      win.id === miniWinId 
        ? { ...win, completed: true }
        : win
    ));
    
    const miniWin = miniWins.find(w => w.id === miniWinId);
    if (miniWin && user) {
      setUser(prev => prev ? {
        ...prev,
        hypePoints: prev.hypePoints + miniWin.points
      } : null);
    }
  };

  const handleQuestComplete = (rewardPoints: number) => {
    if (user) {
      setUser(prev => prev ? {
        ...prev,
        hypePoints: prev.hypePoints + rewardPoints
      } : null);
    }
  };

  const handleOnboardingComplete = (userData: User) => {
    const userWithOnboarding = { ...userData, hasCompletedOnboarding: true };
    setUser(userWithOnboarding);
    setShowOnboarding(false);
    localStorage.setItem('hypeos-user', JSON.stringify(userWithOnboarding));
    
    // Generate initial tasks based on goal
    generateInitialTasks(userData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#39d2c0] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading HypeOS...</p>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to HypeOS! 🚀
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Let's get started by setting up your goals
          </p>
          <Button 
            className="bg-[#39d2c0] hover:bg-[#39d2c0]/90"
            onClick={() => setShowOnboarding(true)}
          >
            Get Started
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <HorizontalNav />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Ready to level up your business today?
              </p>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">View:</span>
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => handleViewModeChange('default')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === 'default'
                      ? 'bg-white dark:bg-gray-700 text-[#39d2c0] shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => handleViewModeChange('quests')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === 'quests'
                      ? 'bg-white dark:bg-gray-700 text-[#39d2c0] shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Target className="h-4 w-4" />
                  <span>Quests</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white dark:bg-slate-900">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.currentStreak}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Level</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.level}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-[#39d2c0]" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Hype Points</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.hypePoints.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Longest Streak</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.longestStreak}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conditional Content Based on View Mode */}
        {viewMode === 'default' ? (
          <>
            {/* Hype Meter */}
            <div className="mb-8">
              <HypeMeter
                progress={user.goalProgress}
                streak={user.currentStreak}
                level={user.level}
                points={user.hypePoints}
                goalTitle={user.goalTitle}
                goalCurrent={user.goalCurrent}
                goalTarget={user.goalTarget}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Today's Focus */}
              <div className="lg:col-span-2">
                <DailyFocusCard
                  tasks={tasks}
                  onTaskComplete={completeTask}
                  onTaskSkip={(taskId) => {
                    console.log('Task skipped:', taskId);
                  }}
                  streak={user.currentStreak}
                  momentumMultiplier={user.currentStreak >= 3 ? 1.5 : 1.0}
                />
              </div>

              {/* Streak Tracker */}
              <div>
                <StreakTracker
                  currentStreak={user.currentStreak}
                  longestStreak={user.longestStreak}
                  totalDaysActive={45}
                  streakGoal={30}
                  onStreakMilestone={(milestone) => {
                    console.log('Streak milestone:', milestone);
                  }}
                />
              </div>
            </div>

            {/* Mini Wins */}
            <div className="mt-8">
              <MiniWins
                miniWins={miniWins}
                onComplete={completeMiniWin}
                streak={user.currentStreak}
              />
            </div>
          </>
        ) : (
          /* Quests View */
          <div className="mt-8">
            <DailyQuests
              tasks={tasks}
              userPoints={user.hypePoints}
              streak={user.currentStreak}
              quests={quests}
              onQuestComplete={handleQuestComplete}
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Button 
            className="bg-[#39d2c0] hover:bg-[#39d2c0]/90"
            onClick={() => window.location.href = '/hypeos/progress'}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            View Progress
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/hypeos/squads'}
          >
            <Users className="w-4 h-4 mr-2" />
            Join Squad
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/hypeos/rewards'}
          >
            <Gift className="w-4 h-4 mr-2" />
            Rewards Store
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/hypeos/daily'}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Daily Focus
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              localStorage.removeItem('hypeos-user');
              localStorage.removeItem('hypeos-quests');
              localStorage.removeItem('hypeos-quest-progress');
              window.location.reload();
            }}
            className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Reset & Start Over
          </Button>
        </div>
      </div>

      {/* Streak Celebration Modal */}
      <StreakCelebration
        isOpen={showStreakCelebration}
        onClose={() => setShowStreakCelebration(false)}
        currentStreak={user?.currentStreak || 0}
        longestStreak={user?.longestStreak || 0}
        weeklyProgress={weeklyProgress}
      />
    </div>
  );
}

// Onboarding Wizard Component
function OnboardingWizard({ onComplete }: { onComplete: (userData: User) => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    goalTitle: '',
    goalDescription: '',
    category: '',
    timeline: '',
    targetValue: '',
    currentValue: ''
  });

  const categories = [
    { value: 'revenue', label: 'Revenue Growth', icon: DollarSign, description: 'Increase monthly income and business revenue' },
    { value: 'audience', label: 'Audience Building', icon: User, description: 'Grow your social media following and email list' },
    { value: 'product', label: 'Product Launch', icon: Rocket, description: 'Create and launch a new product or service' },
    { value: 'marketing', label: 'Marketing Campaign', icon: TrendingUpIcon, description: 'Run successful marketing campaigns' },
    { value: 'skills', label: 'Skill Development', icon: Target, description: 'Learn new skills and improve existing ones' },
    { value: 'content', label: 'Content Creation', icon: BookOpen, description: 'Build a content strategy and create engaging content' },
    { value: 'business', label: 'Business Growth', icon: Building, description: 'Scale your business operations and team' },
    { value: 'fitness', label: 'Health & Fitness', icon: Dumbbell, description: 'Improve physical and mental health' },
    { value: 'creative', label: 'Creative Projects', icon: Palette, description: 'Complete creative projects and artistic goals' },
    { value: 'learning', label: 'Learning & Education', icon: GraduationCap, description: 'Master new subjects and gain certifications' }
  ];

  const timelines = [
    { value: '1-month', label: '1 Month' },
    { value: '3-months', label: '3 Months' },
    { value: '6-months', label: '6 Months' },
    { value: '1-year', label: '1 Year' }
  ];

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      // Start loading and complete onboarding after 7 seconds
      setIsLoading(true);
      
      setTimeout(() => {
        // Complete onboarding
        const userData: User = {
          name: 'User', // This will be replaced with actual user data from database
          level: 1,
          hypePoints: 0,
          currentStreak: 0,
          longestStreak: 0,
          goalProgress: 0,
          goalTitle: formData.goalTitle,
          goalTarget: formData.targetValue,
          goalCurrent: formData.currentValue,
          category: formData.category,
          hasCompletedOnboarding: false
        };
        onComplete(userData);
      }, 7000); // 7 seconds delay
    }
  };

  const handleBack = () => {
    // Go back to the previous page instead of previous step
    window.history.back();
  };

  // Loading screen component
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            {/* Animated target icon */}
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <Target className="h-24 w-24 text-[#39d2c0] animate-pulse" style={{ filter: 'drop-shadow(0 0 20px #39d2c0)' }} />
              <div className="absolute inset-0 animate-spin">
                <div className="w-24 h-24 border-4 border-[#39d2c0]/20 border-t-[#39d2c0] rounded-full"></div>
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Setting Up Your Journey
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            We're preparing your personalized HypeOS experience...
          </p>
          
          {/* Progress dots */}
          <div className="flex justify-center space-x-2">
            {[1, 2, 3].map((dot) => (
              <div
                key={dot}
                className="w-3 h-3 bg-[#39d2c0] rounded-full animate-pulse"
                style={{ animationDelay: `${dot * 0.3}s` }}
              />
            ))}
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
            This will only take a moment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <HorizontalNav />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center space-x-3">
            <span>Welcome to HypeOS!</span>
            <Target className="h-8 w-8 text-[#39d2c0]" />
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Let's set up your goals and start your journey to success
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-[#39d2c0] text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 2 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep 
                      ? 'bg-[#39d2c0]' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          {currentStep === 1 && (
            <Card className="bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-6 w-6 text-[#39d2c0]" />
                  <span>What do you want to achieve?</span>
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Be specific about what you want to create or accomplish in the next few months
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="goalTitle">Your Main Goal</Label>
                  <Input
                    id="goalTitle"
                    placeholder="e.g., Launch my online course and earn R15k/month"
                    value={formData.goalTitle}
                    onChange={(e) => setFormData({...formData, goalTitle: e.target.value})}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    What specific outcome do you want to achieve?
                  </p>
                </div>

                <div>
                  <Label htmlFor="goalDescription">Why is this important to you?</Label>
                  <Textarea
                    id="goalDescription"
                    placeholder="Describe your motivation and what success looks like for you..."
                    value={formData.goalDescription}
                    onChange={(e) => setFormData({...formData, goalDescription: e.target.value})}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="category">What's your main focus area?</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose your primary focus area" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center space-x-3">
                              <Icon className="h-5 w-5 text-[#39d2c0]" />
                              <div>
                                <div className="font-medium">{category.label}</div>
                                <div className="text-xs text-gray-500">{category.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-6 w-6 text-[#39d2c0]" />
                  <span>Set Your Timeline & Success Metrics</span>
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Define when you want to achieve this and how you'll measure success
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="timeline">How long do you want to achieve this?</Label>
                  <Select value={formData.timeline} onValueChange={(value) => setFormData({...formData, timeline: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose your timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      {timelines.map((timeline) => (
                        <SelectItem key={timeline.value} value={timeline.value}>
                          <div className="flex items-center space-x-2">
                            <span>{timeline.label}</span>
                            <span className="text-xs text-gray-500">
                              {timeline.value === '1-month' && 'Quick wins & momentum'}
                              {timeline.value === '3-months' && 'Solid foundation & growth'}
                              {timeline.value === '6-months' && 'Significant progress & results'}
                              {timeline.value === '1-year' && 'Major transformation & mastery'}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentValue">Where are you now?</Label>
                    <Input
                      id="currentValue"
                      placeholder="e.g., R2,500/month, 100 followers, 0 products"
                      value={formData.currentValue}
                      onChange={(e) => setFormData({...formData, currentValue: e.target.value})}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Your current baseline
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="targetValue">Where do you want to be?</Label>
                    <Input
                      id="targetValue"
                      placeholder="e.g., R15,000/month, 10k followers, 3 products"
                      value={formData.targetValue}
                      onChange={(e) => setFormData({...formData, targetValue: e.target.value})}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Your target achievement
                    </p>
                  </div>
                </div>

                {/* Goal Preview */}
                <div className="p-6 bg-gradient-to-r from-[#39d2c0]/10 to-blue-500/10 dark:from-[#39d2c0]/20 dark:to-blue-500/20 rounded-lg border border-[#39d2c0]/20">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-[#39d2c0]" />
                    <span>Your Goal Summary</span>
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      {(() => {
                        const category = categories.find(c => c.value === formData.category);
                        const Icon = category?.icon || Target;
                        return <Icon className="h-4 w-4 text-[#39d2c0]" />;
                      })()}
                      <span className="font-medium">{formData.goalTitle}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>Timeline: {timelines.find(t => t.value === formData.timeline)?.label}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <TrendingUp className="h-4 w-4" />
                      <span>Progress: {formData.currentValue} → {formData.targetValue}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={handleBack}
            >
              Back
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={
                (currentStep === 1 && (!formData.goalTitle || !formData.category)) ||
                (currentStep === 2 && (!formData.timeline || !formData.targetValue))
              }
              className="bg-[#39d2c0] hover:bg-[#39d2c0]/90"
            >
              {currentStep === 2 ? (
                <>
                  Start My Journey
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
