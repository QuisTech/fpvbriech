import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
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

    let createdCount = 0;
    let skippedCount = 0;
    let repairedCount = 0;
    let errors: string[] = [];

    try {
      for (const p of PARTICIPANTS) {
        const email = formatServiceNumberToEmail(p.serviceNumber);
        const displayName = `${p.rank} ${p.name}`;
        
        try {
          // Attempt to create user
          const userCredential = await createUserWithEmailAndPassword(auth, email, DEFAULT_PARTICIPANT_PASSWORD);
          const user = userCredential.user;

          // Update Auth Profile (so name is available without Firestore)
          await updateProfile(user, {
            displayName: displayName
          });

          // Create Firestore document
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
            // Account exists, try to repair it by signing in and updating Firestore
            try {
              const userCredential = await signInWithEmailAndPassword(auth, email, DEFAULT_PARTICIPANT_PASSWORD);
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
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-zinc-800">
      <div className="flex flex-col items-center gap-3">
        <h3 className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Admin Tools</h3>
        
        <button
          onClick={initializeParticipants}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs transition-colors border border-zinc-700"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
          Initialize Participant Accounts
        </button>

        {status && (
          <div className={`text-xs px-3 py-2 rounded-md w-full text-center flex items-center justify-center gap-2 ${
            status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
            status.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
            'bg-blue-500/10 text-blue-400 border border-blue-500/20'
          }`}>
            {status.type === 'success' && <CheckCircle size={12} />}
            {status.type === 'error' && <AlertCircle size={12} />}
            {status.message}
          </div>
        )}
        
        <p className="text-[10px] text-zinc-600 text-center max-w-xs">
          Run this once to create accounts for all 16 participants. 
          <br/>Default password: <strong>{DEFAULT_PARTICIPANT_PASSWORD}</strong>
        </p>
      </div>
    </div>
  );
}
