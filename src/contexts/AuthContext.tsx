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
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, facebookProvider } from '../lib/firebase';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student' | 'guest';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
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

  useEffect(() => {
    if (!auth) {
      console.warn("Auth not initialized (missing config). Skipping auth listener.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          if (db) {
            // Check if user document exists in Firestore
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              // User exists, set state
              const userData = userDocSnap.data() as User;
              setUser({ ...userData, id: firebaseUser.uid });
            } else {
              // New user (e.g. from Google Sign In), create document
              const newUser: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: firebaseUser.displayName || 'New User',
                role: 'student', // Default role
              };
              await setDoc(userDocRef, newUser);
              setUser(newUser);
            }
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

  const checkFirebase = () => {
    if (!auth || !db) {
      throw new Error("Firebase is not configured. Please check your .env file.");
    }
  };

  const loginWithGoogle = async () => {
    try {
      checkFirebase();
      if (!googleProvider) throw new Error("Google provider not configured");
      await signInWithPopup(auth!, googleProvider);
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  const loginWithFacebook = async () => {
    try {
      checkFirebase();
      if (!facebookProvider) throw new Error("Facebook provider not configured");
      await signInWithPopup(auth!, facebookProvider);
    } catch (error) {
      console.error("Facebook login error:", error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      checkFirebase();
      await signInWithEmailAndPassword(auth!, email, password);
    } catch (error) {
      console.error("Email login error:", error);
      throw error;
    }
  };

  const registerWithEmail = async (email: string, password: string, name: string) => {
    try {
      checkFirebase();
      const result = await createUserWithEmailAndPassword(auth!, email, password);
      
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
      await setDoc(doc(db!, 'users', result.user.uid), newUser);
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
    // Guest login remains client-side only for demo purposes
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
