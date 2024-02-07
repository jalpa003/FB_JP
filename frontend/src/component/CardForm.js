import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const CardForm = ({ handlePayment, selectedPlan }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        try {
            // Fetch clientSecret from the server
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/create-checkout-session`,
                { selectedPlan, token },
                {
                    headers: { 'Authorization': `${token}` },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch clientSecret from the server');
            }

            const responseData = await response.json();

            if (responseData.requiresAction) {
                // Handle confirmation for payment method setup
                const { setupIntentClientSecret } = responseData;
                const setupIntentResult = await stripe.confirmCardSetup(setupIntentClientSecret, {
                    payment_method: {
                        card: elements.getElement(CardElement),
                    },
                });

                if (setupIntentResult.error) {
                    console.error(setupIntentResult.error.message);
                    setError(setupIntentResult.error.message);
                    return;
                }

                // If Setup Intent is confirmed, proceed with payment
                setError(null);
                handlePayment();
            } else {
                // Proceed with payment as usual
                const { clientSecret, error } = responseData;

                if (error) {
                    console.error('Error fetching clientSecret:', error);
                    setError(error.message);
                    return;
                }

                // Confirm Payment Intent
                const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: cardElement,
                    },
                });

                if (confirmError) {
                    console.error('Error confirming Payment Intent:', confirmError);
                    setError(confirmError.message);
                    return;
                }

                setError(null);
                handlePayment(paymentIntent);
            }
        } catch (error) {
            console.error('Error handling payment:', error);
            setError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <button type="submit" disabled={!stripe}>
                Pay
            </button>
        </form>
    );
};

export default CardForm;
