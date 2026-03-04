import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, getAuth } from 'firebase/auth';
import { initializeApp, deleteApp } from 'firebase/app';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, firebaseConfig } from '../lib/firebase';
import { PARTICIPANTS, formatServiceNumberToEmail, DEFAULT_PARTICIPANT_PASSWORD } from '../lib/participants';
import { ShieldCheck, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export function ParticipantSetup() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const initializeParticipants = async () => {
    if (!auth || !db) {
      setStatus({ type: 'error', message: 'Firebase is not initialized.' });
      return;
    }

    setLoading(true);
    setStatus({ type: 'info', message: 'Initializing participant accounts...' });

    // Initialize a secondary app to create users without logging out the admin
    const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
    const secondaryAuth = getAuth(secondaryApp);

    let createdCount = 0;
    let skippedCount = 0;
    let repairedCount = 0;
    let errors: string[] = [];

    try {
      for (const p of PARTICIPANTS) {
        const email = formatServiceNumberToEmail(p.serviceNumber);
        const displayName = `${p.rank} ${p.name}`;
        
        try {
          // Attempt to create user using secondary auth
          const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, DEFAULT_PARTICIPANT_PASSWORD);
          const user = userCredential.user;

          // Update Auth Profile (so name is available without Firestore)
          await updateProfile(user, {
            displayName: displayName
          });

          // Create Firestore document using main db (admin has access)
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: email,
            name: displayName,
            role: 'student',
            serviceNumber: p.serviceNumber,
            rank: p.rank,
            createdAt: new Date().toISOString(),
          });

          createdCount++;
        } catch (err: any) {
          if (err.code === 'auth/email-already-in-use') {
            // Account exists, try to repair it by signing in (secondary auth) and updating Firestore
            try {
              const userCredential = await signInWithEmailAndPassword(secondaryAuth, email, DEFAULT_PARTICIPANT_PASSWORD);
              const user = userCredential.user;
              
              await updateProfile(user, {
                displayName: displayName
              });

              await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: email,
                name: displayName,
                role: 'student',
                serviceNumber: p.serviceNumber,
                rank: p.rank,
                updatedAt: new Date().toISOString(), // Mark as updated
              }, { merge: true }); // Merge to preserve existing fields if any

              repairedCount++;
            } catch (repairErr: any) {
               console.error(`Failed to repair ${p.serviceNumber}:`, repairErr);
               errors.push(`${p.serviceNumber} (Repair Failed): ${repairErr.message}`);
            }
          } else {
            console.error(`Failed to create ${p.serviceNumber}:`, err);
            errors.push(`${p.serviceNumber}: ${err.message}`);
          }
        }
      }

      if (errors.length > 0) {
        setStatus({ 
          type: 'error', 
          message: `Created ${createdCount}, Repaired ${repairedCount}. Errors: ${errors.length}` 
        });
      } else {
        setStatus({ 
          type: 'success', 
          message: `Success! Created ${createdCount}, Repaired ${repairedCount} accounts.` 
        });
      }

    } catch (err: any) {
      setStatus({ type: 'error', message: `Fatal error: ${err.message}` });
    } finally {
      // Clean up secondary app
      await deleteApp(secondaryApp);
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-start gap-4">
        
        <button
          onClick={initializeParticipants}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm transition-colors border border-zinc-700"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
          Initialize Participant Accounts
        </button>

        {status && (
          <div className={`text-sm px-4 py-3 rounded-md w-full flex items-center gap-2 ${
            status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
            status.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
            'bg-blue-500/10 text-blue-400 border border-blue-500/20'
          }`}>
            {status.type === 'success' && <CheckCircle size={16} />}
            {status.type === 'error' && <AlertCircle size={16} />}
            {status.message}
          </div>
        )}
        
        <p className="text-xs text-zinc-500">
          This action will create accounts for all 16 participants defined in the system.
          <br/>Default password: <strong className="font-mono text-zinc-400">{DEFAULT_PARTICIPANT_PASSWORD}</strong>
        </p>
      </div>
    </div>
  );
}
