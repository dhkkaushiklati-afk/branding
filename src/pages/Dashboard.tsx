import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, Users, Gift, PlayCircle, Gamepad2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Dashboard: React.FC = () => {
  const { userData, addCoins } = useAuth();

  const quickStats = [
    { label: 'Total Earned', value: `₹${(userData?.totalEarned || 0) / 100}`, icon: TrendingUp, color: 'text-green-500' },
    { label: 'Tasks Done', value: userData?.tasksCompleted || 0, icon: CheckCircle2, color: 'text-blue-500' },
    { label: 'Referrals', value: 0, icon: Users, color: 'text-purple-500' },
  ];

  const handleClaimBonus = async () => {
    // In a real app, we'd check if they already claimed it today
    await addCoins(50, 'Daily Bonus');
    toast.success('Daily bonus of 50 coins claimed!');
  };

  const earningOptions = [
    { title: 'Watch Ads', desc: 'Earn 10 coins per ad', icon: PlayCircle, color: 'bg-orange-100 text-orange-600', coins: '+10', action: () => handleClaimBonus() },
    { title: 'Daily Bonus', desc: 'Claim your daily reward', icon: Gift, color: 'bg-pink-100 text-pink-600', coins: '+50', action: handleClaimBonus },
    { title: 'Play Games', desc: 'Fun games, more coins', icon: Gamepad2, color: 'bg-indigo-100 text-indigo-600', coins: 'Varies', action: () => toast.info('Games coming soon!') },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header / Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-white border-none shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Coins size={120} />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{userData?.coins || 0}</span>
              <span className="text-lg opacity-80 font-medium">Coins</span>
            </div>
            <p className="text-xs mt-1 opacity-70">≈ ₹{(userData?.coins || 0) / 100} INR</p>
            <div className="mt-6 flex gap-3">
              <Button variant="secondary" className="w-full bg-white text-primary hover:bg-white/90">
                Withdraw
              </Button>
              <Button variant="outline" className="w-full border-white text-white hover:bg-white/10">
                History
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {quickStats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * idx }}
          >
            <Card className="text-center p-3 border-none shadow-sm bg-gray-50/50">
              <stat.icon className={cn("w-5 h-5 mx-auto mb-1", stat.color)} />
              <div className="text-sm font-bold">{stat.value}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Earning Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold px-1">Start Earning</h3>
        <div className="grid gap-3">
          {earningOptions.map((option, idx) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + (0.1 * idx) }}
            >
              <Card 
                className="hover:shadow-md transition-shadow cursor-pointer group"
                onClick={option.action}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn("p-3 rounded-2xl", option.color)}>
                      <option.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{option.title}</h4>
                      <p className="text-xs text-gray-500">{option.desc}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                    {option.coins}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Daily Task Progress */}
      <Card className="border-dashed border-2 bg-transparent">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Daily Goal</p>
              <p className="text-sm font-bold">5/10 Tasks Completed</p>
            </div>
          </div>
          <Button size="sm" variant="ghost" className="text-primary font-bold">
            View All
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
