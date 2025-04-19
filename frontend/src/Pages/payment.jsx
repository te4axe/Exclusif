import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();

  const { product, shippingInfo, paymentMethod } = location.state || {};

  const [isProcessing, setIsProcessing] = useState(false);
  const amount = product?.price * 100; // amount in cents

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || !product) return;

    setIsProcessing(true);
    try {

      // 1. Create Payment Intent
      const { data } = await axios.post("http://localhost:5000/api/payments/create-payment-intent", {
        amount,
        
      });

      const clientSecret = data.clientSecret;

      // 2. Confirm Card Payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      // 3. Handle Result
      if (result.error) {
        alert(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        alert("✅ Payment successful!");

        navigate("/order-success", {
          state: { product, shippingInfo, paymentMethod },
        });
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form
      onSubmit={handlePaymentSubmit}
      className="max-w-md mx-auto bg-white shadow-lg p-6 rounded-lg mt-10 space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Payment Details</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">Card Details</label>
        <div className="border p-3 rounded-md shadow-sm">
          <CardElement />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-blue-600 text-white py-3 rounded-md font-bold hover:bg-blue-700 transition duration-300 disabled:opacity-50"
      >
        {isProcessing ? "Processing..." : `Pay $${product?.price}`}
      </button>
    </form>
  );
};

export default Payment;
