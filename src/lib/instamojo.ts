import axios from 'axios';

interface PaymentResponse {
  success: boolean;
  payment_request?: {
    longurl: string;
    id: string;
  };
  error?: string;
}

export const createPaymentRequest = async (
  amount: number, 
  purpose: string, 
  buyerName: string, 
  email: string, 
  phone: string
): Promise<PaymentResponse> => {
  try {
    // Create payment request body
    const paymentData = {
      purpose: purpose,
      amount: amount.toString(),
      buyerName: buyerName,
      email: email,
      phone: phone
    };

    // Make API request to our server endpoint
    const response = await axios.post('/api/create-payment', paymentData);
    
    return response.data;
  } catch (error) {
    console.error('Payment creation failed:', error);
    return {
      success: false,
      error: 'Payment creation failed. Please try again later.'
    };
  }
};

// Generate unique SSGC25 ID
export const generateUniqueId = (): string => {
  const prefix = 'SSGC25';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let uniqueId = '';
  
  // Generate 12 random characters
  for (let i = 0; i < 12; i++) {
    uniqueId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return `${prefix}${uniqueId}`;
};