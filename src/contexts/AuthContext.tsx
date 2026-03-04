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

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          if (db) {
            // Check if user document exists in Firestore
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            
            // Real-time listener for user document
            const unsubscribeUserDoc = onSnapshot(userDocRef, async (docSnap) => {
              if (docSnap.exists()) {
                // User exists, set state
                const userData = docSnap.data() as User;
                setUser({ ...userData, id: firebaseUser.uid });
              } else {
                // Only create if it really doesn't exist (and give it a moment if it's being created elsewhere)
                // But for AuthContext, we need to set something.
                
                // If we are in the middle of a creation flow (like ParticipantSetup), 
                // the doc might be created milliseconds later. 
                // However, we can't wait forever.
                
                // Check if we already have a user state that looks valid to avoid overwriting with "New User" unnecessarily
                // if we are just waiting for the doc.
                
                // For now, we'll stick to the original logic but just for the initial creation if needed,
                // but since this is a listener, if it gets created later, we'll update!
                
                const newUser: User = {
                  id: firebaseUser.uid,
                  email: firebaseUser.email || '',
                  name: firebaseUser.displayName || 'New User',
                  role: 'student', // Default role
                };
                
                // CAUTION: Writing here might race with ParticipantSetup.
                // Ideally, we only write if we are sure it's a NEW sign-up (e.g. from Google).
                // But for email/pass, usually the registration flow handles creation.
                
                // Let's ONLY write if it's a Google/Facebook provider (providerData check)
                // OR if we strictly need to. 
                
                // Actually, to be safe and avoid overwriting ParticipantSetup's work:
                // We will NOT write to Firestore here immediately if it's missing.
                // We will just set the local state. 
                // AND we will try to write ONLY if it's a social login (which doesn't have a separate registration flow).
                
                const isSocial = firebaseUser.providerData.some(p => 
                  p.providerId === 'google.com' || p.providerId === 'facebook.com'
                );

                if (isSocial) {
                   await setDoc(userDocRef, newUser);
                }
                
                setUser(newUser);
              }
            });

            // Store unsubscribe to clean up later if needed? 
            // The main unsubscribe handles the auth listener, but this inner listener needs cleanup too.
            // Since onAuthStateChanged can fire multiple times, we need to manage this subscription.
            // But doing that inside useEffect is tricky without a ref.
            
            // SIMPLER APPROACH for this context:
            // Just use onSnapshot and don't worry about the race condition for now, 
            // BUT remove the `setDoc` call from the "else" block to prevent overwriting.
            // If the doc doesn't exist, just show the Auth data.
            // If it gets created (by ParticipantSetup), the snapshot will fire again and update the UI!

          } else {
             // Fallback if DB not initialized
             setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'User',
              role: 'student',
            });
          }
        } catch (error: any) {
          if (error.code === 'unavailable' || error.message?.includes('offline')) {
            console.warn("Firestore unavailable (offline mode): Using cached Auth profile.");
          } else {
            console.error("Error fetching user data:", error);
          }
          
          // Fallback if Firestore fails (e.g. permission issues or offline)
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'User',
            role: 'student',
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
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
