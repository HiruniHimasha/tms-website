import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

export const addTestUsers = async () => {
  const testUsers = [
    {
      nameWithInitial: 'John D. Smith',
      email: 'john.smith@example.com',
      idNumber: 'EMP001',
      address: '123 Main Street, Colombo',
      phone1: '+94112345678',
      phone2: '+94771234567', // WhatsApp
      phone3: '+94112654321', // Landline
      trained: true,
      medium: 'English',
      dateOfList: new Date('2024-01-15'),
      remarks: 'Excellent performance',
      status: 'pending',
      formType: 'TOT',
      createdAt: new Date()
    },
    {
      nameWithInitial: 'Maria G. Perera',
      email: 'maria.perera@example.com',
      idNumber: 'EMP002',
      address: '456 Galle Road, Galle',
      phone1: '+94118765432',
      phone2: '+94777654321',
      phone3: null,
      trained: false,
      medium: 'Sinhala',
      dateOfList: new Date('2024-01-16'),
      remarks: 'Needs additional training',
      status: 'pending',
      formType: 'TOT',
      createdAt: new Date()
    }
  ];

  try {
    for (const user of testUsers) {
      await addDoc(collection(db, 'users'), user);
      console.log('Test user added:', user.nameWithInitial);
    }
    console.log('All test users added successfully!');
  } catch (error) {
    console.error('Error adding test users:', error);
  }
};