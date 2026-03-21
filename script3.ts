import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
});

const db = getFirestore(app);

async function run() {
  try {
    const snap = await getDocs(collection(db, 'users'));
    const users = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const scored = users.filter(u => u.cbt1Score !== undefined || u.cbt2Score !== undefined);
    
    fs.writeFileSync('result.json', JSON.stringify(scored, null, 2));
    console.log('Saved', scored.length, 'users to result.json');
    process.exit(0);
  } catch (e) {
    console.error("Firestore error:", e);
    process.exit(1);
  }
}

run();
