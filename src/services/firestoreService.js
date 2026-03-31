import { db, auth } from '../firebase';
import { collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';

// Guardar lectura de Tarot
export const saveTarotReading = async (cards, spreadType, question = '') => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    const readingData = {
      userId: user.uid,
      type: 'tarot',
      spreadType, // 'one-card' o 'three-cards'
      cards, // Array de cartas
      question,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'users', user.uid, 'readings'), readingData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error guardando lectura de tarot:', error);
    return { success: false, error: error.message };
  }
};

// Guardar lectura de Horóscopo
export const saveHoroscopeReading = async (signData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    const readingData = {
      userId: user.uid,
      type: 'horoscope',
      sign: signData.nombre,
      prediction: signData.caracteristicas_generales,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'users', user.uid, 'readings'), readingData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error guardando horóscopo:', error);
    return { success: false, error: error.message };
  }
};

// Guardar lectura de Numerología
export const saveNumerologyReading = async (number, numerologyData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    const readingData = {
      userId: user.uid,
      type: 'numerology',
      number,
      archetype: numerologyData.arquetipo,
      energy: numerologyData.energia_principal,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'users', user.uid, 'readings'), readingData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error guardando numerología:', error);
    return { success: false, error: error.message };
  }
};

// Obtener todas las lecturas del usuario
export const getUserReadings = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    const q = query(
      collection(db, 'users', user.uid, 'readings'),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const readings = [];
    
    querySnapshot.forEach((doc) => {
      readings.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return { success: true, readings };
  } catch (error) {
    console.error('Error obteniendo lecturas:', error);
    return { success: false, error: error.message, readings: [] };
  }
};