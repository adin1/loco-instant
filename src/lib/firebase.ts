import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
  getDocFromServer,
  Unsubscribe,
  DocumentData
} from 'firebase/firestore';
import firebaseConfig from "../../firebase-applet-config.json";
import { UserProfile, QuoteRequest, OrderItem, Review } from '../types';

// 1. Inițializare sigură Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 2. Inițializare sigură Firestore (fără crash dacă databaseId lipsește)
const dbId = (firebaseConfig as any).firestoreDatabaseId;
export const db = dbId && dbId !== '(default)' 
  ? getFirestore(app, dbId) 
  : getFirestore(app);

// 3. Inițializare Auth
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

// Tipuri de erori
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Loghează eroarea fără a bloca randarea React
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): void {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Warning/Error: ', JSON.stringify(errInfo));
}

// Test conexiune în fundal
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    return false;
  }
}

// Helpers Autentificare
export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    return result.user;
  } catch (error) {
    console.error('Eroare autentificare Google:', error);
    return null;
  }
}

export async function logOut(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Eroare deconectare:', error);
  }
}

// Sincronizare Profil Utilizator
export function subscribeToUserProfile(userId: string, onUpdate: (user: UserProfile | null) => void): Unsubscribe {
  const userDocRef = doc(db, 'users', userId);
  return onSnapshot(
    userDocRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as UserProfile);
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${userId}`);
      onUpdate(null);
    }
  );
}

export async function saveUserProfileToFirestore(user: UserProfile): Promise<void> {
  const path = `users/${user.id}`;
  try {
    await setDoc(doc(db, 'users', user.id), user, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Sincronizare Cereri de Ofertă
export function subscribeToUserQuotes(userId: string, onUpdate: (quotes: QuoteRequest[]) => void): Unsubscribe {
  const quotesRef = collection(db, 'quoteRequests');
  const q = query(quotesRef, where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: QuoteRequest[] = [];
      snapshot.forEach((d) => items.push({ id: d.id, ...(d.data() as Omit<QuoteRequest, 'id'>) }));
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'quoteRequests');
      onUpdate([]);
    }
  );
}

export async function createQuoteRequestInFirestore(quote: QuoteRequest): Promise<void> {
  const path = `quoteRequests/${quote.id}`;
  try {
    await setDoc(doc(db, 'quoteRequests', quote.id), quote);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Sincronizare Comenzi
export function subscribeToUserOrders(userId: string, onUpdate: (orders: OrderItem[]) => void): Unsubscribe {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, where('clientId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: OrderItem[] = [];
      snapshot.forEach((d) => items.push({ id: d.id, ...(d.data() as Omit<OrderItem, 'id'>) }));
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
      onUpdate([]);
    }
  );
}

export { app };
export default app;