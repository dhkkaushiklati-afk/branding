import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet as WalletIcon, ArrowUpRight, History, CreditCard, Smartphone, Banknote, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

const Wallet: React.FC = () => {
  const { userData, sendNotification } = useAuth();
  const [amount, setAmount] = useState('');
  const [upi, setUpi] = useState('');
  const [loading, setLoading] = useState(false);

  const handleWithdraw = () => {
    if (!amount || !upi) {
      toast.error('Please fill all details');
      return;
    }
    const coins = parseInt(amount);
    if (coins < 5000) {
      toast.error('Minimum withdrawal is 5000 coins (₹50)');
      return;
    }
    if (coins > (userData?.coins || 0)) {
      toast.error('Insufficient balance');
      return;
    }

    setLoading(true);
    // Simulate withdrawal request
    setTimeout(async () => {
      await sendNotification(
        'Withdrawal Requested', 
        `Your request for ₹${coins/100} has been submitted successfully.`, 
        'withdrawal'
      );
      toast.success('Withdrawal request submitted! Payout in 24-48 hours.');
      setLoading(false);
      setAmount('');
      setUpi('');
    }, 2000);
  };

  const methods = [
    { id: 'paytm', name: 'Paytm', icon: Smartphone, color: 'text-blue-500' },
    { id: 'upi', name: 'UPI', icon: CreditCard, color: 'text-purple-500' },
    { id: 'bank', name: 'Bank', icon: Banknote, color: 'text-green-500' },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="px-1">
        <h2 className="text-2xl font-black">My Wallet</h2>
        <p className="text-sm text-gray-500">Withdraw your earnings to your account</p>
      </div>

      <Card className="bg-white border-none shadow-sm">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Available Balance</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black">{userData?.coins || 0}</span>
              <span className="text-sm font-bold text-gray-400">Coins</span>
            </div>
            <p className="text-xs text-green-600 font-bold mt-1">≈ ₹{(userData?.coins || 0) / 100} INR</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <WalletIcon size={32} />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-bold px-1">Withdraw Money</h3>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {methods.map((m) => (
                <div key={m.id} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-primary/50 cursor-pointer transition-colors">
                  <m.icon className={m.color} size={24} />
                  <span className="text-[10px] font-bold">{m.name}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (in Coins)</Label>
              <Input 
                id="amount" 
                type="number" 
                placeholder="Min 5000" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="upi">UPI ID / Mobile Number</Label>
              <Input 
                id="upi" 
                placeholder="example@upi" 
                value={upi}
                onChange={(e) => setUpi(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>

            <Button 
              onClick={handleWithdraw} 
              disabled={loading}
              className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Withdraw Now'}
            </Button>
            <p className="text-[10px] text-center text-gray-400">
              Minimum withdrawal: 5000 coins (₹50)
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold">Recent History</h3>
          <Button variant="ghost" size="sm" className="text-primary font-bold">View All</Button>
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Card key={i} className="border-none shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <ArrowUpRight size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Daily Bonus</p>
                    <p className="text-[10px] text-gray-500">14 April 2026, 10:30 AM</p>
                  </div>
                </div>
                <span className="text-sm font-black text-green-600">+50</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
