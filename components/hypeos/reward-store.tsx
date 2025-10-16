'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Gift, 
  Lock, 
  Star, 
  Crown,
  Zap,
  Target,
  Users,
  BookOpen,
  Settings,
  Sparkles,
  ArrowLeft,
  Mail,
  Smartphone,
  BarChart3,
  ClipboardList,
  User,
  FileText,
  TrendingUp,
  Rocket,
  Palette,
  Bot,
  Handshake,
  Medal,
  Award,
  Trophy
} from 'lucide-react';

interface Reward {
  id: number;
  title: string;
  description: string;
  points: number;
  category: 'templates' | 'courses' | 'tools' | 'perks' | 'premium';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlocked: boolean;
  icon: React.ComponentType<{ className?: string }>;
  comingSoon?: boolean;
}

interface RewardStoreProps {
  userPoints: number;
  onRedeemReward: (rewardId: number, points: number) => void;
}

export default function RewardStore({ userPoints, onRedeemReward }: RewardStoreProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');

  const rewards: Reward[] = [
    // Bronze Tier (0-1k points)
    {
      id: 1,
      title: "Email Template Pack",
      description: "10 professional email templates for outreach",
      points: 200,
      category: 'templates',
      tier: 'bronze',
      unlocked: userPoints >= 200,
      icon: Mail
    },
    {
      id: 2,
      title: "Social Media Templates",
      description: "20 ready-to-use social media post templates",
      points: 300,
      category: 'templates',
      tier: 'bronze',
      unlocked: userPoints >= 300,
      icon: Smartphone
    },
    {
      id: 3,
      title: "Basic Analytics Course",
      description: "Learn to track your business metrics",
      points: 500,
      category: 'courses',
      tier: 'bronze',
      unlocked: userPoints >= 500,
      icon: BarChart3
    },

    // Silver Tier (1k-5k points)
    {
      id: 4,
      title: "Advanced Marketing Course",
      description: "Complete marketing strategy course",
      points: 1200,
      category: 'courses',
      tier: 'silver',
      unlocked: userPoints >= 1200,
      icon: Target
    },
    {
      id: 5,
      title: "CRM Setup Guide",
      description: "Step-by-step CRM implementation",
      points: 800,
      category: 'tools',
      tier: 'silver',
      unlocked: userPoints >= 800,
      icon: ClipboardList
    },
    {
      id: 6,
      title: "Priority Support",
      description: "Get faster support responses",
      points: 1000,
      category: 'perks',
      tier: 'silver',
      unlocked: userPoints >= 1000,
      icon: Zap
    },

    // Gold Tier (5k-10k points)
    {
      id: 7,
      title: "1-on-1 Mentor Session",
      description: "30-minute session with business expert",
      points: 5000,
      category: 'perks',
      tier: 'gold',
      unlocked: userPoints >= 5000,
      icon: User
    },
    {
      id: 8,
      title: "Custom Business Plan",
      description: "Personalized business strategy document",
      points: 3000,
      category: 'tools',
      tier: 'gold',
      unlocked: userPoints >= 3000,
      icon: FileText
    },
    {
      id: 9,
      title: "Premium Analytics Dashboard",
      description: "Advanced tracking and insights",
      points: 2500,
      category: 'tools',
      tier: 'gold',
      unlocked: userPoints >= 2500,
      icon: TrendingUp
    },

    // Platinum Tier (10k+ points)
    {
      id: 10,
      title: "VIP Mastermind Access",
      description: "Join exclusive entrepreneur group",
      points: 10000,
      category: 'perks',
      tier: 'platinum',
      unlocked: userPoints >= 10000,
      icon: Crown
    },
    {
      id: 11,
      title: "Custom Brand Kit",
      description: "Professional logo and brand assets",
      points: 8000,
      category: 'tools',
      tier: 'platinum',
      unlocked: userPoints >= 8000,
      icon: Palette
    },
    {
      id: 12,
      title: "Business Accelerator Program",
      description: "6-month intensive growth program",
      points: 15000,
      category: 'courses',
      tier: 'platinum',
      unlocked: userPoints >= 15000,
      icon: Rocket
    },

    // Coming Soon
    {
      id: 13,
      title: "AI Content Generator",
      description: "AI-powered content creation tool",
      points: 2000,
      category: 'tools',
      tier: 'silver',
      unlocked: false,
      icon: Bot,
      comingSoon: true
    },
    {
      id: 14,
      title: "Networking Event Access",
      description: "Exclusive networking events",
      points: 3000,
      category: 'perks',
      tier: 'gold',
      unlocked: false,
      icon: Handshake,
      comingSoon: true
    }
  ];

  const categories = [
    { value: 'all', label: 'All Rewards', icon: Gift },
    { value: 'templates', label: 'Templates', icon: BookOpen },
    { value: 'courses', label: 'Courses', icon: Target },
    { value: 'tools', label: 'Tools', icon: Settings },
    { value: 'perks', label: 'Perks', icon: Star }
  ];

  const tiers = [
    { value: 'all', label: 'All Tiers', color: 'bg-gray-100 text-gray-800' },
    { value: 'bronze', label: 'Bronze', color: 'bg-orange-100 text-orange-800' },
    { value: 'silver', label: 'Silver', color: 'bg-gray-100 text-gray-800' },
    { value: 'gold', label: 'Gold', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'platinum', label: 'Platinum', color: 'bg-purple-100 text-purple-800' }
  ];

  const filteredRewards = rewards.filter(reward => {
    const categoryMatch = selectedCategory === 'all' || reward.category === selectedCategory;
    const tierMatch = selectedTier === 'all' || reward.tier === selectedTier;
    return categoryMatch && tierMatch;
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'silver': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'gold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'platinum': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTierIcon = (tier: string) => {
    const iconClass = "h-4 w-4";
    switch (tier) {
      case 'bronze': return <Medal className={`${iconClass} text-orange-500`} />;
      case 'silver': return <Award className={`${iconClass} text-gray-400`} />;
      case 'gold': return <Trophy className={`${iconClass} text-yellow-500`} />;
      case 'platinum': return <Crown className={`${iconClass} text-purple-500`} />;
      default: return <Star className={`${iconClass} text-[#39d2c0]`} />;
    }
  };

  const canAfford = (points: number) => userPoints >= points;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Redeem your Hype Points for amazing rewards
          </h1>
          <div className="inline-flex items-center space-x-2 bg-[#39d2c0]/10 px-4 py-2 rounded-lg border border-[#39d2c0]/20 mt-4">
            <Zap className="h-5 w-5 text-[#39d2c0]" />
            <span className="text-lg font-semibold text-[#39d2c0]">
              {userPoints.toLocaleString()} Points
            </span>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-white dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Category
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <Button
                        key={category.value}
                        variant={selectedCategory === category.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.value)}
                        className={selectedCategory === category.value ? "bg-[#39d2c0] hover:bg-[#39d2c0]/90" : ""}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {category.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Tier Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Tier
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tiers.map((tier) => (
                    <Button
                      key={tier.value}
                      variant={selectedTier === tier.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTier(tier.value)}
                      className={selectedTier === tier.value ? "bg-[#39d2c0] hover:bg-[#39d2c0]/90" : ""}
                    >
                      {tier.value !== 'all' && (
                        <span className="mr-1">{getTierIcon(tier.value)}</span>
                      )}
                      {tier.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRewards.map((reward) => (
            <Card 
              key={reward.id} 
              className={`bg-white dark:bg-slate-900 transition-all duration-200 ${
                reward.unlocked && !reward.comingSoon
                  ? 'hover:shadow-lg hover:scale-105' 
                  : 'opacity-75'
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <reward.icon className="h-6 w-6 text-[#39d2c0]" />
                    <CardTitle className="text-lg">{reward.title}</CardTitle>
                  </div>
                  <Badge className={getTierColor(reward.tier)}>
                    <span className="flex items-center space-x-1">
                      {getTierIcon(reward.tier)}
                      <span className="capitalize">{reward.tier}</span>
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {reward.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-[#39d2c0]" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {reward.points.toLocaleString()} points
                    </span>
                  </div>
                  {reward.comingSoon && (
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Coming Soon
                    </Badge>
                  )}
                </div>

                {reward.comingSoon ? (
                  <Button disabled className="w-full">
                    <Lock className="w-4 h-4 mr-2" />
                    Coming Soon
                  </Button>
                ) : reward.unlocked ? (
                  <Button 
                    className="w-full bg-[#39d2c0] hover:bg-[#39d2c0]/90"
                    onClick={() => onRedeemReward(reward.id, reward.points)}
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Redeem Now
                  </Button>
                ) : (
                  <Button disabled className="w-full">
                    <Lock className="w-4 h-4 mr-2" />
                    Need {reward.points - userPoints} more points
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Points Guide */}
        <Card className="mt-8 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-[#39d2c0]" />
              <span>How to Earn More Points</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Daily Actions</h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Complete daily tasks (100-500 points)</li>
                  <li>• Finish mini wins (25-50 points)</li>
                  <li>• Maintain streaks (bonus multipliers)</li>
                  <li>• Hit milestones (500-2000 points)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Bonus Activities</h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Help others in squads (100 points)</li>
                  <li>• Complete challenges (300-1000 points)</li>
                  <li>• Share achievements (50 points)</li>
                  <li>• Invite friends (500 points)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
