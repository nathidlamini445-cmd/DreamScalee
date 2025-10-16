'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { HorizontalNav } from '@/components/horizontal-nav';
import { 
  Users, 
  Plus, 
  Search,
  Crown,
  Star,
  Flame,
  Target,
  ArrowLeft,
  UserPlus,
  MessageSquare
} from 'lucide-react';

// Mock data for squads
const mockSquads = [
  {
    id: 1,
    name: "Growth Hackers",
    description: "Entrepreneurs focused on rapid business growth",
    memberCount: 8,
    maxMembers: 10,
    level: "Gold",
    streak: 15,
    totalPoints: 12500,
    isJoined: true,
    isOwner: false,
    members: [
      { name: "Alex", level: 7, streak: 12, avatar: "👨‍💼" },
      { name: "Sarah", level: 9, streak: 18, avatar: "👩‍💻" },
      { name: "Mike", level: 6, streak: 8, avatar: "👨‍🎨" },
      { name: "Emma", level: 8, streak: 22, avatar: "👩‍🚀" }
    ]
  },
  {
    id: 2,
    name: "Content Creators",
    description: "Building audiences through consistent content",
    memberCount: 12,
    maxMembers: 15,
    level: "Silver",
    streak: 8,
    totalPoints: 8900,
    isJoined: false,
    isOwner: false,
    members: [
      { name: "Jake", level: 5, streak: 6, avatar: "🎬" },
      { name: "Lisa", level: 7, streak: 14, avatar: "📸" },
      { name: "Tom", level: 6, streak: 9, avatar: "🎵" }
    ]
  },
  {
    id: 3,
    name: "My Squad",
    description: "Personal accountability group",
    memberCount: 3,
    maxMembers: 5,
    level: "Bronze",
    streak: 5,
    totalPoints: 3200,
    isJoined: true,
    isOwner: true,
    members: [
      { name: "You", level: 7, streak: 12, avatar: "👤" },
      { name: "Friend 1", level: 4, streak: 3, avatar: "👥" },
      { name: "Friend 2", level: 6, streak: 7, avatar: "👥" }
    ]
  }
];

export default function SquadsPage() {
  const [squads, setSquads] = useState(mockSquads);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredSquads = squads.filter(squad =>
    squad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    squad.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJoinSquad = (squadId: number) => {
    setSquads(squads.map(squad => 
      squad.id === squadId 
        ? { ...squad, isJoined: true, memberCount: squad.memberCount + 1 }
        : squad
    ));
  };

  const handleLeaveSquad = (squadId: number) => {
    setSquads(squads.map(squad => 
      squad.id === squadId 
        ? { ...squad, isJoined: false, memberCount: squad.memberCount - 1 }
        : squad
    ));
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Gold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Silver': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'Bronze': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'Gold': return '🥇';
      case 'Silver': return '🥈';
      case 'Bronze': return '🥉';
      default: return '⭐';
    }
  };

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
              Accountability Squads 👥
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Join forces with like-minded entrepreneurs and stay motivated together
            </p>
          </div>
          
          <Button 
            className="bg-[#39d2c0] hover:bg-[#39d2c0]/90"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Squad
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search squads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* My Squads */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            My Squads
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSquads.filter(squad => squad.isJoined).map((squad) => (
              <Card key={squad.id} className="bg-white dark:bg-slate-900">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{squad.name}</CardTitle>
                    {squad.isOwner && (
                      <Crown className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {squad.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Squad Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Members</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {squad.memberCount}/{squad.maxMembers}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Squad Streak</span>
                      <div className="flex items-center space-x-1">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {squad.streak} days
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Total Points</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {squad.totalPoints.toLocaleString()}
                      </span>
                    </div>

                    <Badge className={getLevelColor(squad.level)}>
                      {getLevelIcon(squad.level)} {squad.level}
                    </Badge>

                    {/* Squad Members */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Squad Members
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {squad.members.slice(0, 4).map((member, index) => (
                          <div key={index} className="flex items-center space-x-1 text-xs">
                            <span>{member.avatar}</span>
                            <span className="text-gray-600 dark:text-gray-400">
                              {member.name}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              L{member.level}
                            </Badge>
                          </div>
                        ))}
                        {squad.members.length > 4 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{squad.members.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        onClick={() => window.location.href = `/squads/${squad.id}/chat`}
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Chat
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        onClick={() => window.location.href = `/squads/${squad.id}/progress`}
                      >
                        <Target className="w-4 h-4 mr-1" />
                        Progress
                      </Button>
                      {!squad.isOwner && (
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleLeaveSquad(squad.id)}
                        >
                          Leave
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Available Squads */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Available Squads
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSquads.filter(squad => !squad.isJoined).map((squad) => (
              <Card key={squad.id} className="bg-white dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-lg">{squad.name}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {squad.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Squad Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Members</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {squad.memberCount}/{squad.maxMembers}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Squad Streak</span>
                      <div className="flex items-center space-x-1">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {squad.streak} days
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Total Points</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {squad.totalPoints.toLocaleString()}
                      </span>
                    </div>

                    <Badge className={getLevelColor(squad.level)}>
                      {getLevelIcon(squad.level)} {squad.level}
                    </Badge>

                    {/* Squad Members Preview */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Squad Members
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {squad.members.slice(0, 3).map((member, index) => (
                          <div key={index} className="flex items-center space-x-1 text-xs">
                            <span>{member.avatar}</span>
                            <span className="text-gray-600 dark:text-gray-400">
                              {member.name}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              L{member.level}
                            </Badge>
                          </div>
                        ))}
                        {squad.members.length > 3 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{squad.members.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Join Button */}
                    <Button 
                      className="w-full bg-[#39d2c0] hover:bg-[#39d2c0]/90"
                      onClick={() => handleJoinSquad(squad.id)}
                      disabled={squad.memberCount >= squad.maxMembers}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      {squad.memberCount >= squad.maxMembers ? 'Squad Full' : 'Join Squad'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Create Squad Modal Placeholder */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle>Create New Squad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Squad creation feature coming soon! For now, join existing squads to start collaborating.
                </p>
                <Button 
                  className="w-full"
                  onClick={() => setShowCreateForm(false)}
                >
                  Got it!
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
