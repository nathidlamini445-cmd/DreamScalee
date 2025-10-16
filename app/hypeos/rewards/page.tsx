'use client';

import { useState, useEffect } from 'react';
import { HorizontalNav } from '@/components/horizontal-nav';
import RewardStore from '@/components/hypeos/reward-store';

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

export default function RewardsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user data from localStorage
    const savedUser = localStorage.getItem('hypeos-user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const handleRedeemReward = (rewardId: number, points: number) => {
    if (!user) return;
    
    // Check if user has enough points
    if (user.hypePoints < points) {
      alert(`You need ${points - user.hypePoints} more points to redeem this reward!`);
      return;
    }

    // Deduct points and update user
    const updatedUser = {
      ...user,
      hypePoints: user.hypePoints - points
    };
    
    setUser(updatedUser);
    localStorage.setItem('hypeos-user', JSON.stringify(updatedUser));
    
    // Show success message
    alert(`Reward redeemed successfully! You now have ${updatedUser.hypePoints} points remaining. Check your email for details.`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#39d2c0] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading rewards...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <HorizontalNav />
        <div className="container mx-auto px-4 py-8 pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Please complete onboarding first
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You need to set up your goals before accessing the rewards store.
            </p>
            <button 
              onClick={() => window.location.href = '/hypeos'}
              className="bg-[#39d2c0] hover:bg-[#39d2c0]/90 text-white px-6 py-2 rounded-lg"
            >
              Go to HypeOS
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <HorizontalNav />
      <RewardStore 
        userPoints={user.hypePoints}
        onRedeemReward={handleRedeemReward}
      />
    </div>
  );
}
