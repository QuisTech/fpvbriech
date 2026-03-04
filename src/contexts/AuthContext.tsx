import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, googleProvider, facebookProvider } from '../lib/firebase';
import { PARTICIPANTS } from '../lib/participants';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student' | 'guest';
  rank?: string;
  serviceNumber?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isDemo: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loginAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    if (!auth) {
      console.warn("Auth not initialized (missing config). Enabling Demo Mode.");
      setIsDemo(true);
      setLoading(false);
      return;
    }

    let unsubscribeUserDoc: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      // Unsubscribe from previous user listener if any to prevent memory leaks
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc();
        unsubscribeUserDoc = undefined;
      }

      if (firebaseUser) {
        try {
          if (db) {
            // Check if user document exists in Firestore
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            
            // Real-time listener for user document
            unsubscribeUserDoc = onSnapshot(userDocRef, async (docSnap) => {
              if (docSnap.exists()) {
                // User exists, set state
                const userData = docSnap.data() as User;
                setUser({ ...userData, id: firebaseUser.uid });
              } else {
                // New user logic (e.g. first time Google login)
                const newUser: User = {
                  id: firebaseUser.uid,
                  email: firebaseUser.email || '',
                  name: firebaseUser.displayName || 'New User',
                  role: (firebaseUser.email === 'michquis@gmail.com') ? 'admin' : 'student', // Auto-admin for specific email
                };
                
                // Check if social login to auto-create doc
                // We check providerData to see if they signed in via Google/Facebook
                const isSocial = firebaseUser.providerData.some(p => 
                  ['google.com', 'facebook.com'].includes(p.providerId)
                );

                // Only auto-create doc for social logins. 
                // Email/password registration handles doc creation separately in registerWithEmail.
                if (isSocial) {
                   try {
                     await setDoc(userDocRef, newUser, { merge: true });
                   } catch (e) {
                     console.error("Error creating user doc for social login:", e);
                   }
                }
                
                setUser(newUser);
              }
              // Data loaded, stop loading
              setLoading(false);
            }, (error) => {
               console.error("Firestore snapshot error:", error);
               // Fallback to auth data if firestore fails
               setUser({
                  id: firebaseUser.uid,
                  email: firebaseUser.email || '',
                  name: firebaseUser.displayName || 'User',
                  role: 'student',
               });
               setLoading(false);
            });
          } else {
             // Fallback if DB not initialized
             setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'User',
              role: 'student',
            });
            setLoading(false);
          }
        } catch (error: any) {
          if (error.code === 'unavailable' || error.message?.includes('offline')) {
            console.warn("Firestore unavailable (offline mode): Using cached Auth profile.");
          } else {
            console.error("Error fetching user data:", error);
          }
          
          // Fallback if Firestore fails
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'User',
            role: 'student',
          });
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUserDoc) unsubscribeUserDoc();
    };
  }, []);

  const loginWithGoogle = async () => {
    if (isDemo) {
      // Simulate Google Login in Demo Mode
      const mockUser: User = {
        id: 'demo-google-user',
        email: 'demo@gmail.com',
        name: 'Demo Google User',
        role: 'student'
      };
      setUser(mockUser);
      return;
    }

    try {
      if (!auth || !googleProvider) throw new Error("Google provider not configured");
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  const loginWithFacebook = async () => {
    if (isDemo) {
      // Simulate Facebook Login in Demo Mode
      const mockUser: User = {
        id: 'demo-facebook-user',
        email: 'demo@facebook.com',
        name: 'Demo Facebook User',
        role: 'student'
      };
      setUser(mockUser);
      return;
    }

    try {
      if (!auth || !facebookProvider) throw new Error("Facebook provider not configured");
      await signInWithPopup(auth, facebookProvider);
    } catch (error) {
      console.error("Facebook login error:", error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    if (isDemo) {
      // Simulate Email Login in Demo Mode
      // Check if it matches a participant
      const participant = PARTICIPANTS.find(p => 
        email.includes(p.serviceNumber.replace(/\//g, '_').toLowerCase())
      );

      if (participant) {
        setUser({
          id: `demo-${participant.sn}`,
          email: email,
          name: `${participant.rank} ${participant.name}`,
          role: 'student',
          rank: participant.rank,
          serviceNumber: participant.serviceNumber
        });
      } else {
        // Generic demo user
        setUser({
          id: 'demo-user',
          email: email,
          name: 'Demo User',
          role: 'student'
        });
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return;
    }

    try {
      if (!auth) throw new Error("Firebase auth not initialized");
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Email login error:", error);
      throw error;
    }
  };

  const registerWithEmail = async (email: string, password: string, name: string) => {
    if (isDemo) {
      // Simulate Registration in Demo Mode
      setUser({
        id: 'demo-new-user',
        email: email,
        name: name,
        role: 'student'
      });
      await new Promise(resolve => setTimeout(resolve, 800));
      return;
    }

    try {
      if (!auth || !db) throw new Error("Firebase not initialized");
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Auth Profile
      await updateProfile(result.user, {
        displayName: name
      });

      // Create user document in Firestore immediately
      const newUser: User = {
        id: result.user.uid,
        email: email,
        name: name,
        role: 'student',
      };
      await setDoc(doc(db, 'users', result.user.uid), newUser);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const loginAsGuest = () => {
    setUser({
      id: 'guest',
      email: '',
      name: 'Guest User',
      role: 'guest',
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isDemo,
      loginWithGoogle, 
      loginWithFacebook, 
      loginWithEmail, 
      registerWithEmail, 
      logout, 
      loginAsGuest 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
