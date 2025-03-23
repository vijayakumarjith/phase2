import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Instamojo API endpoints
const INSTAMOJO_API_ENDPOINT = 'https://test.instamojo.com/api/1.1';

// Create payment request
app.post('/api/create-payment', async (req, res) => {
  try {
    const { amount, purpose, buyerName, email, phone } = req.body;
    
    const payload = {
      purpose,
      amount,
      buyer_name: buyerName,
      email,
      phone,
      redirect_url: `${req.headers.origin}/payment/success`,
      webhook: `${req.headers.origin}/api/webhook`,
      allow_repeated_payments: false,
      send_email: true,
      send_sms: true
    };

    const response = await axios.post(
      `${INSTAMOJO_API_ENDPOINT}/payment-requests/`, 
      payload,
      {
        headers: {
          'X-Api-Key': process.env.VITE_INSTAMOJO_API_KEY,
          'X-Auth-Token': process.env.VITE_INSTAMOJO_AUTH_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      payment_request: {
        id: response.data.payment_request.id,
        longurl: response.data.payment_request.longurl
      }
    });
  } catch (error) {
    console.error('Payment creation error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Payment creation failed. Please try again later.'
    });
  }
});

// Payment webhook
app.post('/api/webhook', (req, res) => {
  const { payment_id, payment_request_id, status } = req.body;
  
  // Here you would update your database with the payment status
  console.log(`Payment ${payment_id} for request ${payment_request_id} is ${status}`);
  
  res.status(200).send('Webhook received');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});