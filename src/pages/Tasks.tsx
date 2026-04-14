import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PlayCircle, 
  Download, 
  Instagram, 
  Youtube, 
  Twitter, 
  CheckCircle2, 
  Loader2, 
  History, 
  ClipboardList,
  Calendar,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

const Tasks: React.FC = () => {
  const { completeTask, taskHistory } = useAuth();
  const [completing, setCompleting] = useState<string | null>(null);
  const [justCompleted, setJustCompleted] = useState<string | null>(null);

  const tasks = [
    { id: 'ad1', title: 'Watch Video Ad', desc: 'Watch a 30s video to earn', icon: PlayCircle, reward: 10, type: 'ad' },
    { id: 'ad2', title: 'Watch Video Ad', desc: 'Watch a 30s video to earn', icon: PlayCircle, reward: 10, type: 'ad' },
    { id: 'app1', title: 'Install App', desc: 'Install and open for 1 min', icon: Download, reward: 500, type: 'app' },
    { id: 'social1', title: 'Follow on Instagram', desc: 'Follow our official page', icon: Instagram, reward: 50, type: 'social' },
    { id: 'social2', title: 'Subscribe YouTube', desc: 'Subscribe and hit bell icon', icon: Youtube, reward: 50, type: 'social' },
    { id: 'social3', title: 'Follow on Twitter', desc: 'Follow for latest updates', icon: Twitter, reward: 50, type: 'social' },
  ];

  const handleComplete = async (taskId: string, title: string, reward: number) => {
    setCompleting(taskId);
    try {
      // Simulate task completion delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      await completeTask(taskId, title, reward);
      
      // Trigger Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#008000', '#0000FF', '#FF0000']
      });

      setJustCompleted(taskId);
      toast.success(`Task Completed! You earned ${reward} coins.`);
      
      // Reset success state after 3 seconds
      setTimeout(() => setJustCompleted(null), 3000);
    } catch (error) {
      toast.error('Failed to complete task. Please try again.');
    } finally {
      setCompleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-6 pb-20">
      <Tabs defaultValue="available" className="w-full">
        <div className="px-1 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-black">Tasks</h2>
              <p className="text-sm text-gray-500">Complete tasks to earn coins instantly</p>
            </div>
          </div>
          <TabsList className="grid w-full grid-cols-2 bg-gray-100/50 p-1 rounded-xl">
            <TabsTrigger value="available" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <ClipboardList className="w-4 h-4 mr-2" />
              Available
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="available" className="m-0 space-y-4">
          <div className="grid gap-4">
            {tasks.map((task, idx) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className={`overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-500 ${justCompleted === task.id ? 'bg-green-50 ring-2 ring-green-500 ring-offset-2' : ''}`}>
                  <CardContent className="p-4 flex items-center justify-between relative overflow-hidden">
                    <AnimatePresence>
                      {justCompleted === task.id && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 0.1, scale: 2 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-green-500 pointer-events-none"
                        />
                      )}
                    </AnimatePresence>

                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-500 ${justCompleted === task.id ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {justCompleted === task.id ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 12 }}
                          >
                            <CheckCircle2 size={24} />
                          </motion.div>
                        ) : (
                          <task.icon size={24} />
                        )}
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm transition-colors ${justCompleted === task.id ? 'text-green-700' : ''}`}>{task.title}</h4>
                        <p className="text-[10px] text-gray-500">{task.desc}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 border-none transition-colors ${justCompleted === task.id ? 'bg-green-200 text-green-700' : 'bg-primary/10 text-primary'}`}>
                            +{task.reward} Coins
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative z-10">
                      {justCompleted === task.id ? (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-1 text-green-600 font-black text-sm"
                        >
                          <Sparkles size={16} className="animate-pulse" />
                          DONE
                        </motion.div>
                      ) : (
                        <Button 
                          size="sm" 
                          disabled={completing === task.id}
                          onClick={() => handleComplete(task.id, task.title, task.reward)}
                          className="rounded-xl font-bold px-4"
                        >
                          {completing === task.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Start'
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="m-0 space-y-4">
          {taskHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 opacity-50">
              <History size={48} className="text-gray-400" />
              <div>
                <p className="font-bold">No history yet</p>
                <p className="text-xs">Complete your first task to see it here!</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              {taskHistory.map((history, idx) => (
                <motion.div
                  key={history.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <Card className="border-none shadow-sm bg-white/50">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs">{history.taskTitle}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                              <Calendar size={10} />
                              {formatDate(history.completedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-green-600">
                          +{history.reward}
                        </span>
                        <p className="text-[8px] uppercase tracking-tighter text-gray-400 font-bold">Coins</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tasks;
