import  { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';

const Payment = () => {
  const [amount, setAmount] = useState(5000); // Amount in cents (5000 = $50)
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});
  const stripe = useStripe();
  const elements = useElements();

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  // Validate form before submission
  const validateForm = () => {
    let valid = true;
    let newErrors = {};
    if (!paymentInfo.cardNumber) {
      newErrors.cardNumber = "Card number is required.";
      valid = false;
    }
    if (!paymentInfo.expiryDate) {
      newErrors.expiryDate = "Expiry date is required.";
      valid = false;
    }
    if (!paymentInfo.cvv) {
      newErrors.cvv = "CVV is required.";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  // Handle payment submission
  const handlePaymentSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    // Call backend to create PaymentIntent and get clientSecret
    const { data } = await axios.post('http://localhost:5000/api/payments/create-payment-intent', {
      amount: amount,
    });

    const clientSecret = data.clientSecret;

    // Confirm payment with Stripe
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        alert('Payment successful!');
        // Perform post-payment actions (e.g., update order status)
      }
    }
  };

  return (
    <form onSubmit={handlePaymentSubmit}>
      <div>
        <label>Card Number</label>
        <CardElement />
        {errors.cardNumber && <p>{errors.cardNumber}</p>}
      </div>

      <div>
        <label>Expiry Date</label>
        <input
          type="text"
          name="expiryDate"
          value={paymentInfo.expiryDate}
          onChange={handleInputChange}
          placeholder="MM/YY"
        />
        {errors.expiryDate && <p>{errors.expiryDate}</p>}
      </div>

      <div>
        <label>CVV</label>
        <input
          type="text"
          name="cvv"
          value={paymentInfo.cvv}
          onChange={handleInputChange}
          placeholder="123"
        />
        {errors.cvv && <p>{errors.cvv}</p>}
      </div>

      <button type="submit" disabled={!stripe}>
        Pay Now
      </button>
    </form>
  );
};

export default Payment;
