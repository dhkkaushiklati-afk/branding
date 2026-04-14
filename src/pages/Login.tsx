import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, ShieldCheck, Zap, TrendingUp, Mail, Lock, User } from 'lucide-react';
import { motion } from 'motion/react';

const Login: React.FC = () => {
  const { login, loginWithEmail, registerWithEmail, isLoggingIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const features = [
    { icon: ShieldCheck, text: 'Secure Wallet System', color: 'text-blue-500' },
    { icon: Zap, text: 'Instant Payouts', color: 'text-yellow-500' },
    { icon: TrendingUp, text: 'High Earning Rates', color: 'text-green-500' },
  ];

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithEmail(email, password);
  };

  const handleEmailRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerWithEmail(email, password, name);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 pb-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white shadow-xl mb-4">
            <Coins size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">EarnMate</h1>
          <p className="text-gray-500 font-medium">Earn real money by doing simple tasks</p>
        </div>

        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
          <Tabs defaultValue="google" className="w-full">
            <TabsList className="w-full grid grid-cols-2 rounded-none h-12 bg-gray-100/50">
              <TabsTrigger value="google" className="font-bold data-[state=active]:bg-white">Google</TabsTrigger>
              <TabsTrigger value="email" className="font-bold data-[state=active]:bg-white">Email</TabsTrigger>
            </TabsList>
            
            <TabsContent value="google" className="m-0">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">Quick Login</CardTitle>
                <CardDescription>Use your Google account to start earning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="grid gap-4">
                  {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                      <f.icon className={f.color} size={18} />
                      {f.text}
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={login}
                  disabled={isLoggingIn}
                  className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20"
                >
                  {isLoggingIn ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Connecting...
                    </div>
                  ) : (
                    <>
                      <img 
                        src="https://www.google.com/favicon.ico" 
                        alt="Google" 
                        className="w-5 h-5 mr-2"
                        referrerPolicy="no-referrer"
                      />
                      Continue with Google
                    </>
                  )}
                </Button>
              </CardContent>
            </TabsContent>

            <TabsContent value="email" className="m-0">
              <Tabs defaultValue="signin" className="w-full">
                <div className="px-6 pt-4">
                  <TabsList className="w-full grid grid-cols-2 bg-gray-100 h-9 rounded-lg p-1">
                    <TabsTrigger value="signin" className="text-xs font-bold rounded-md">Sign In</TabsTrigger>
                    <TabsTrigger value="signup" className="text-xs font-bold rounded-md">Sign Up</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="signin" className="p-6 pt-4 space-y-4">
                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="name@example.com" 
                          className="pl-10 h-11 rounded-xl"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                        <Input 
                          id="password" 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-10 h-11 rounded-xl"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isLoggingIn}
                      className="w-full h-11 rounded-xl font-bold"
                    >
                      {isLoggingIn ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="p-6 pt-4 space-y-4">
                  <form onSubmit={handleEmailRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={18} />
                        <Input 
                          id="reg-name" 
                          type="text" 
                          placeholder="John Doe" 
                          className="pl-10 h-11 rounded-xl"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                        <Input 
                          id="reg-email" 
                          type="email" 
                          placeholder="name@example.com" 
                          className="pl-10 h-11 rounded-xl"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                        <Input 
                          id="reg-password" 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-10 h-11 rounded-xl"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isLoggingIn}
                      className="w-full h-11 rounded-xl font-bold"
                    >
                      {isLoggingIn ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>

          <div className="bg-gray-50/50 p-4 border-t border-gray-100">
            <p className="text-[10px] text-center text-gray-400 px-4">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </Card>

        <div className="flex justify-center gap-8 opacity-50">
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold">10K+</span>
            <span className="text-[10px] uppercase tracking-widest">Users</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold">₹5L+</span>
            <span className="text-[10px] uppercase tracking-widest">Paid Out</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
