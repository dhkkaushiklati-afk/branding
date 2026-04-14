import React from 'react';
import { useAuth } from '../../lib/AuthContext';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Bell, Trash2, CheckCircle2, AlertCircle, Wallet, Gift, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const NotificationCenter: React.FC = () => {
  const { notifications, markAsRead, deleteNotification } = useAuth();
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'task': return <CheckCircle2 className="text-blue-500" size={18} />;
      case 'bonus': return <Gift className="text-pink-500" size={18} />;
      case 'withdrawal': return <Wallet className="text-green-500" size={18} />;
      default: return <AlertCircle className="text-gray-500" size={18} />;
    }
  };

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="relative" />}>
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount}
          </span>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-black">Notifications</SheetTitle>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                {unreadCount} New
              </Badge>
            )}
          </div>
          <SheetDescription>
            Stay updated with your earnings and tasks.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <Bell size={32} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">No notifications yet</p>
                  <p className="text-sm text-gray-500">We'll notify you when something happens.</p>
                </div>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={cn(
                      "relative p-4 rounded-2xl border transition-all",
                      notif.read ? "bg-white border-gray-100" : "bg-primary/5 border-primary/10 shadow-sm"
                    )}
                    onClick={() => !notif.read && markAsRead(notif.id)}
                  >
                    <div className="flex gap-4">
                      <div className="mt-1">{getIcon(notif.type)}</div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm">{notif.title}</h4>
                          <span className="text-[10px] text-gray-400">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{notif.message}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-400 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif.id);
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationCenter;
