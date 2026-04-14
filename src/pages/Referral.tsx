import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share2, Copy, Users, Gift, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

const Refer: React.FC = () => {
  const { userData } = useAuth();
  const referralCode = userData?.referralCode || 'LOADING...';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied!');
  };

  const shareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'EarnMate',
        text: `Join EarnMate and earn real money! Use my referral code: ${referralCode}`,
        url: window.location.origin,
      });
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="px-1">
        <h2 className="text-2xl font-black">Refer & Earn</h2>
        <p className="text-sm text-gray-500">Invite friends and earn bonus coins</p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-none shadow-xl overflow-hidden relative">
          <div className="absolute -bottom-4 -right-4 opacity-10">
            <Share2 size={160} />
          </div>
          <CardHeader>
            <CardTitle className="text-center text-xl">Get 500 Coins Free!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm opacity-90">
              For every friend who joins using your code, you both get 500 coins instantly.
            </p>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <p className="text-[10px] uppercase tracking-widest opacity-70 mb-2">Your Referral Code</p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-3xl font-black tracking-tighter">{referralCode}</span>
                <Button size="icon" variant="ghost" onClick={copyToClipboard} className="hover:bg-white/20">
                  <Copy size={20} />
                </Button>
              </div>
            </div>
            <Button onClick={shareLink} className="w-full bg-white text-indigo-600 hover:bg-white/90 font-bold h-12 rounded-xl">
              Share Invite Link
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 text-center border-none shadow-sm bg-white">
          <Users className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
          <div className="text-xl font-bold">0</div>
          <div className="text-[10px] text-gray-500 uppercase">Friends Joined</div>
        </Card>
        <Card className="p-4 text-center border-none shadow-sm bg-white">
          <Gift className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <div className="text-xl font-bold">0</div>
          <div className="text-[10px] text-gray-500 uppercase">Coins Earned</div>
        </Card>
      </div>

      <Card className="bg-orange-50 border-orange-100">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <Trophy size={24} />
          </div>
          <div>
            <h4 className="font-bold text-sm">Referral Leaderboard</h4>
            <p className="text-xs text-gray-600">Top referrers win ₹1000 every week!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Refer;
