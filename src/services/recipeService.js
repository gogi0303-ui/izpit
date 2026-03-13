import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const recipesRef = collection(db, 'recipes');

export async function getRecipesByCategory(category) {
  const q = query(recipesRef, where('category', '==', category));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function getRecipeById(id) {
  const docRef = doc(db, 'recipes', id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
}

export async function createRecipe(data) {
  const docRef = await addDoc(recipesRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateRecipe(id, data) {
  const docRef = doc(db, 'recipes', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteRecipe(id) {
  const docRef = doc(db, 'recipes', id);
  await deleteDoc(docRef);
}
