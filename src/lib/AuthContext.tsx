import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, collection, addDoc, query, where, orderBy, limit, updateDoc, deleteDoc, getDocFromServer } from 'firebase/firestore';
import { auth, db } from './firebase';
import { toast } from 'sonner';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  coins: number;
  referralCode: string;
  referredBy: string | null;
  dailyStreak: number;
  lastLogin: string | null;
  totalEarned: number;
  tasksCompleted: number;
}

interface TaskHistory {
  id: string;
  userId: string;
  taskId: string;
  taskTitle: string;
  reward: number;
  completedAt: string;
}

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'task' | 'bonus' | 'withdrawal' | 'system';
  read: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  notifications: Notification[];
  taskHistory: TaskHistory[];
  loading: boolean;
  isLoggingIn: boolean;
  login: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  addCoins: (amount: number, reason?: string) => Promise<void>;
  completeTask: (taskId: string, title: string, reward: number) => Promise<void>;
  sendNotification: (title: string, message: string, type: Notification['type']) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Connection test
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const unsubData = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
          } else {
            const newUserData: UserData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              coins: 0,
              referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
              referredBy: null,
              dailyStreak: 0,
              lastLogin: new Date().toISOString(),
              totalEarned: 0,
              tasksCompleted: 0,
            };
            setDoc(userDocRef, newUserData).catch(err => handleFirestoreError(err, OperationType.WRITE, 'users'));
            setUserData(newUserData);
          }
        }, (err) => handleFirestoreError(err, OperationType.GET, 'users'));

        // Listen for notifications
        const qNotifs = query(
          collection(db, 'notifications'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
        const unsubNotifications = onSnapshot(qNotifs, (snapshot) => {
          const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
          setNotifications(notifs);
        }, (err) => handleFirestoreError(err, OperationType.LIST, 'notifications'));

        // Listen for task history
        const qHistory = query(
          collection(db, 'taskHistory'),
          where('userId', '==', user.uid),
          orderBy('completedAt', 'desc'),
          limit(50)
        );
        const unsubHistory = onSnapshot(qHistory, (snapshot) => {
          const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TaskHistory));
          setTaskHistory(history);
        }, (err) => handleFirestoreError(err, OperationType.LIST, 'taskHistory'));

        return () => {
          unsubData();
          unsubNotifications();
          unsubHistory();
        };
      } else {
        setUserData(null);
        setNotifications([]);
        setTaskHistory([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const provider = new GoogleAuthProvider();
      // Force account selection to ensure the popup is interactive
      provider.setCustomParameters({ prompt: 'select_account' });
      
      console.log("Initiating Google Sign-In...");
      const result = await signInWithPopup(auth, provider);
      console.log("Sign-In successful:", result.user.email);
      toast.success('Logged in successfully!');
    } catch (error: any) {
      console.error("Login Error Details:", error);
      
      let message = 'Failed to login with Google';
      if (error.code === 'auth/popup-blocked') {
        message = 'Popup blocked! Please allow popups for this site in your browser settings.';
      } else if (error.code === 'auth/unauthorized-domain') {
        message = `This domain (${window.location.hostname}) is not authorised in Firebase Console. Please add it to Authorized Domains.`;
      } else if (error.code === 'auth/popup-closed-by-user') {
        message = 'Login cancelled. Please keep the popup open to sign in.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        return; // Ignore multiple clicks
      } else if (error.message) {
        message = error.message;
      }
      
      toast.error(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      toast.success('Logged in successfully!');
    } catch (error: any) {
      console.error("Email Login Error:", error);
      let message = 'Failed to login';
      if (error.code === 'auth/invalid-credential') {
        message = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email. Please sign up first.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password. Please try again.';
      } else if (error.message) {
        message = error.message;
      }
      toast.error(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(result.user, { displayName: name });
      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error("Registration Error:", error);
      let message = 'Failed to register';
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already in use. Please sign in instead.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password is too weak. Please use at least 6 characters.';
      } else if (error.message) {
        message = error.message;
      }
      toast.error(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const sendNotification = async (title: string, message: string, type: Notification['type']) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'notifications'), {
        userId: user.uid,
        title,
        message,
        type,
        read: false,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'notifications');
    }
  };

  const addCoins = async (amount: number, reason?: string) => {
    if (!user || !userData) return;
    const userDocRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userDocRef, {
        coins: (userData.coins || 0) + amount,
        totalEarned: (userData.totalEarned || 0) + amount,
        tasksCompleted: (userData.tasksCompleted || 0) + 1,
      });
      
      if (reason) {
        await sendNotification('Coins Earned!', `You received ${amount} coins for ${reason}.`, 'bonus');
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'users');
    }
  };

  const completeTask = async (taskId: string, title: string, reward: number) => {
    if (!user || !userData) return;
    
    try {
      // Add history record
      await addDoc(collection(db, 'taskHistory'), {
        userId: user.uid,
        taskId,
        taskTitle: title,
        reward,
        completedAt: new Date().toISOString(),
      });

      // Add coins
      await addCoins(reward, `completing task: ${title}`);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'taskHistory');
    }
  };

  const markAsRead = async (id: string) => {
    const docRef = doc(db, 'notifications', id);
    try {
      await updateDoc(docRef, { read: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'notifications');
    }
  };

  const deleteNotification = async (id: string) => {
    const docRef = doc(db, 'notifications', id);
    try {
      await deleteDoc(docRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'notifications');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userData, 
      notifications, 
      taskHistory,
      loading, 
      isLoggingIn,
      login, 
      loginWithEmail,
      registerWithEmail,
      logout, 
      addCoins, 
      completeTask,
      sendNotification, 
      markAsRead, 
      deleteNotification 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
