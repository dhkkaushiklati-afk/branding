/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { Toaster } from 'sonner';
import BottomNav from './components/layout/BottomNav';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Tasks from './pages/Tasks';
import Refer from './pages/Referral';
import Wallet from './pages/Wallet';
import NotificationCenter from './components/notifications/NotificationCenter';

const Profile = () => {
  const { logout, userData } = useAuth();
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
          {userData?.displayName?.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-bold">{userData?.displayName}</h2>
          <p className="text-sm text-gray-500">{userData?.email}</p>
        </div>
      </div>
      
      <div className="grid gap-3">
        <div className="p-4 bg-white rounded-xl shadow-sm flex items-center justify-between">
          <span className="text-sm font-medium">Account Status</span>
          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Active</span>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-sm flex items-center justify-between">
          <span className="text-sm font-medium">KYC Verification</span>
          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Pending</span>
        </div>
      </div>

      <button 
        onClick={logout}
        className="w-full p-4 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

function AppContent() {
  const { user, loading, userData } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard />;
      case 'tasks': return <Tasks />;
      case 'refer': return <Refer />;
      case 'wallet': return <Wallet />;
      case 'profile': return <Profile />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative shadow-2xl">
      <header className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-xl font-black text-primary">EarnMate</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
            <span className="text-xs font-bold text-primary">Coins: {userData?.coins || 0}</span>
          </div>
          <NotificationCenter />
        </div>
      </header>
      
      <main className="p-4 overflow-y-auto h-[calc(100vh-128px)]">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <Toaster position="top-center" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

