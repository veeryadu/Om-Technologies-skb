import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

// 1. Types & Models
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'client' | 'admin';
  createdAt?: any;
  lastLogin?: any;
}

export interface ClientProject {
  id?: string;
  userId: string;
  title: string;
  category: 'Website' | 'Mobile App' | 'AI Voice Agent' | 'Automation' | 'Full-Stack';
  status: 'planning' | 'in-development' | 'review' | 'completed';
  budget?: string;
  description: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface ClientOrder {
  id?: string;
  userId: string;
  serviceId?: string;
  serviceName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'delivered' | 'cancelled';
  paymentMethod: string;
  createdAt?: any;
}

export interface AIServiceItem {
  id?: string;
  name: string;
  tagline: string;
  category: string;
  price: number;
  deliveryDays: number;
  features: string[];
  active: boolean;
  createdAt?: any;
}

export interface ContactMessage {
  id?: string;
  userId?: string | null;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt?: any;
}

// 2. User Service
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

// 3. Projects Service
export async function createProject(project: Omit<ClientProject, 'id' | 'createdAt' | 'updatedAt'>) {
  const path = 'projects';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...project,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    throw err;
  }
}

export async function getUserProjects(userId: string): Promise<ClientProject[]> {
  const path = 'projects';
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ClientProject));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

// 4. Orders Service
export async function createOrder(order: Omit<ClientOrder, 'id' | 'createdAt'>) {
  const path = 'orders';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...order,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    throw err;
  }
}

export async function getUserOrders(userId: string): Promise<ClientOrder[]> {
  const path = 'orders';
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ClientOrder));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

// 5. Services Catalog Service
export async function getActiveServices(): Promise<AIServiceItem[]> {
  const path = 'services';
  try {
    const q = query(collection(db, path), where('active', '==', true));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AIServiceItem));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

// 6. Contact Messages Service
export async function submitContactMessage(msg: Omit<ContactMessage, 'id' | 'read' | 'createdAt'>) {
  const path = 'contact_messages';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...msg,
      read: false,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    throw err;
  }
}
