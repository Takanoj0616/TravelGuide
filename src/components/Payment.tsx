import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaymentFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccess, onError }) => {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });

      if (error) {
        onError(error.message || t('payment.genericError'));
      } else {
        // バックエンドで決済処理を実行
        const response = await fetch('/api/create-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentMethodId: paymentMethod.id,
            amount: 1000, // 10ドル
            currency: 'usd',
          }),
        });

        const result = await response.json();

        if (result.success) {
          onSuccess();
        } else {
          onError(result.error || t('payment.genericError'));
        }
      }
    } catch (error: unknown) {
      let errorMessage = t('payment.error');
      if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }
      console.error("Payment error:", error);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border rounded-lg p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? t('payment.processing') : t('payment.pay')}
      </button>
    </form>
  );
};

interface PaymentProps {
  onPaymentSuccess: () => void;
}

export const Payment: React.FC<PaymentProps> = ({ onPaymentSuccess }) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">{t('payment.title')}</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Elements stripe={stripePromise}>
        <PaymentForm
          onSuccess={onPaymentSuccess}
          onError={setError}
        />
      </Elements>

      <div className="mt-6 text-sm text-gray-500">
        <p>{t('payment.secure')}</p>
        <p>{t('payment.refund')}</p>
      </div>
    </div>
  );
}; 