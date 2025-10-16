'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HorizontalNav } from '@/components/horizontal-nav';
import DailyFocusCard from '@/components/hypeos/daily-focus-card';
import MiniWins from '@/components/hypeos/mini-wins';
import { 
  Target, 
  Zap, 
  Calendar,
  Clock,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';

// Mock data
const mockTasks = [
  { 
    id: 1, 
    title: "Post 3 TikToks", 
    completed: false, 
    points: 150, 
    impact: "medium" as const,
    category: "content",
    estimatedTime: "30 min"
  },
  { 
    id: 2, 
    title: "Email 5 potential clients", 
    completed: false, 
    points: 300, 
    impact: "high" as const,
    category: "sales",
    estimatedTime: "45 min"
  },
  { 
    id: 3, 
    title: "Update pricing page", 
    completed: false, 
    points: 200, 
    impact: "medium" as const,
    category: "admin",
    estimatedTime: "20 min"
  },
  { 
    id: 4, 
    title: "Research competitor pricing", 
    completed: true, 
    points: 100, 
    impact: "low" as const,
    category: "research",
    estimatedTime: "15 min"
  }
];

const mockMiniWins = [
  { 
    id: 1, 
    title: "Check analytics", 
    completed: false, 
    points: 25, 
    time: "2 min",
    category: "admin",
    difficulty: "easy" as const
  },
  { 
    id: 2, 
    title: "Reply to comments", 
    completed: false, 
    points: 30, 
    time: "3 min",
    category: "social",
    difficulty: "easy" as const
  },
  { 
    id: 3, 
    title: "Update bio", 
    completed: true, 
    points: 20, 
    time: "1 min",
    category: "admin",
    difficulty: "easy" as const
  }
];

export default function DailyFocusPage() {
  const [tasks, setTasks] = useState(mockTasks);
  const [miniWins, setMiniWins] = useState(mockMiniWins);
  const [userPoints, setUserPoints] = useState(2450);
  const [currentStreak, setCurrentStreak] = useState(12);

  const completeTask = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: true }
        : task
    ));
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setUserPoints(prev => prev + task.points);
    }
  };

  const completeMiniWin = (miniWinId: number) => {
    setMiniWins(miniWins.map(win => 
      win.id === miniWinId 
        ? { ...win, completed: true }
        : win
    ));
    
    const miniWin = miniWins.find(w => w.id === miniWinId);
    if (miniWin) {
      setUserPoints(prev => prev + miniWin.points);
    }
  };

  const skipTask = (taskId: number) => {
    // Handle task skip logic
    console.log('Task skipped:', taskId);
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const completedMiniWins = miniWins.filter(win => win.completed).length;
  const totalMiniWins = miniWins.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <HorizontalNav />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Daily Focus 🎯
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Your tasks for today - let's make progress!
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">Today's Progress</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(completionRate)}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {completedTasks}/{totalTasks} tasks
            </div>
          </div>
        </div>

        {/* Daily Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white dark:bg-slate-900">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-[#39d2c0]" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Mini Wins</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedMiniWins}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Points Earned</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tasks.reduce((sum, task) => sum + (task.completed ? task.points : 0), 0) +
                     miniWins.reduce((sum, win) => sum + (win.completed ? win.points : 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Time Saved</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(
                      tasks
                        .filter(task => task.completed)
                        .reduce((sum, task) => {
                          const time = parseInt(task.estimatedTime?.replace(/\D/g, '') || '0');
                          return sum + time;
                        }, 0) / 60
                    )}h
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Focus Tasks */}
          <div>
            <DailyFocusCard
              tasks={tasks}
              onTaskComplete={completeTask}
              onTaskSkip={skipTask}
              streak={currentStreak}
              momentumMultiplier={currentStreak >= 3 ? 1.5 : 1.0}
            />
          </div>

          {/* Mini Wins */}
          <div>
            <MiniWins
              miniWins={miniWins}
              onComplete={completeMiniWin}
              streak={currentStreak}
            />
          </div>
        </div>

        {/* Motivational Section */}
        <Card className="mt-8 bg-white dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {completionRate === 100 
                  ? "Perfect Day! 🎉" 
                  : completionRate >= 75 
                  ? "Almost There! 💪" 
                  : completionRate >= 50 
                  ? "Great Progress! ⭐" 
                  : "Keep Going! 🚀"
                }
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {completionRate === 100 
                  ? "You've completed all your tasks today! You're unstoppable!"
                  : completionRate >= 75 
                  ? "You're doing amazing! Just a few more tasks to go."
                  : completionRate >= 50 
                  ? "You're making solid progress. Keep the momentum going!"
                  : "Every task you complete brings you closer to your goals. You've got this!"
                }
              </p>
              
              {completionRate < 100 && (
                <div className="flex justify-center space-x-4">
                  <Button 
                    className="bg-[#39d2c0] hover:bg-[#39d2c0]/90"
                    onClick={() => {
                      // Focus on next incomplete task
                      const nextTask = tasks.find(task => !task.completed);
                      if (nextTask) {
                        document.getElementById(`task-${nextTask.id}`)?.scrollIntoView({ 
                          behavior: 'smooth' 
                        });
                      }
                    }}
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Focus on Next Task
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = '/hypeos/rewards'}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    View Rewards
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
