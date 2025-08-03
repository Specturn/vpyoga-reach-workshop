export interface Registration {
  id?: string;
  fullName: string;
  email: string;
  userEmail?: string;
  phone: string;
  age: string;
  experience: 'Beginner' | 'Intermediate' | 'Advanced';
  transactionId: string;
  paymentConfirmed: boolean;
  timestamp: number;
  userId?: string;
}

export interface RegistrationFormData {
  fullName: string;
  email: string;
  phone: string;
  age: string;
  experience: 'Beginner' | 'Intermediate' | 'Advanced';
  transactionId: string;
}