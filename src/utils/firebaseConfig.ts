
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration - these are public keys that can safely be in the client
const firebaseConfig = {
  apiKey: "AIzaSyD_Z9FMkXqCbRqL5lZ7H4PEXn4ET-EYdQc",
  authDomain: "studdy-buddy-app.firebaseapp.com",
  projectId: "studdy-buddy-app",
  storageBucket: "studdy-buddy-app.appspot.com",
  messagingSenderId: "689752981671",
  appId: "1:689752981671:web:c809c71bbbda3b9267d479",
  databaseURL: "https://studdy-buddy-app-default-rtdb.firebaseio.com"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
