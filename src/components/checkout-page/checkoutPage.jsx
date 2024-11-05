import React, { useState, useEffect } from 'react';
import './checkoutPage.css';
import MasterCard from '../../assets/mc.png'; 
import Visa from '../../assets/visa.png'; 
import Amex from '../../assets/amex.png'; 
import { useNavigate } from 'react-router-dom'; 

function CheckoutPage() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [orderSummary, setOrderSummary] = useState({
        subtotal: 0,
        shipping: 10,
        total: 0,
    });

    useEffect(() => {
        const fetchOrderSummary = async () => {
            try {
                const response = await fetch('./backend/order_summary.php', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                if (data.success) {
                    // Add shipping to total price fetched from order summary
                    const total = data.total_price + orderSummary.shipping;
                    setOrderSummary({
                        subtotal: data.total_price,
                        shipping: orderSummary.shipping,
                        total: total,
                    });
                } else {
                    console.error('Failed to fetch order summary:', data.message);
                }
            } catch (error) {
                console.error('Error fetching order summary:', error);
            }
        };

        fetchOrderSummary();
    }, []); // Fetch order summary on component mount

    const handlePurchase = async () => {
        try {
            const response = await fetch('./backend/order_summary.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Use application/json
                },
                body: JSON.stringify({
                    totalPrice: orderSummary.total, // Stringify the object
                }),
            });
    
            const data = await response.json();
            if (data.success) {
                alert(data.message);
                navigate('/dataGridPage');
            } else {
                console.error('Failed to complete purchase:', data.message);
            }
        } catch (error) {
            console.error('Error during purchase:', error);
        }
    };
    return (
        <div className="checkout-container">
            <div className="card-details">
                <h2>Card Details</h2>
                <div className="card-type-images">
                    <img src={MasterCard} alt="MasterCard" />
                    <img src={Visa} alt="Visa" />
                    <img src={Amex} alt="American Express" />
                    <button className="see-all-button">See All</button>
                </div>
                <label htmlFor="name-on-card">Name on Card</label>
                <input
                    type="text"
                    id="name-on-card"
                    name="name-on-card"
                    placeholder="John Doe"
                />
                <label htmlFor="card-number">Card Number</label>
                <input
                    type="text"
                    id="card-number"
                    name="card-number"
                    placeholder="1234 5678 9123 4567"
                />
                <div className="exp-cvv">
                    <div>
                        <label htmlFor="expiration-date">Expiration Date</label>
                        <input
                            type="text"
                            id="expiration-date"
                            name="expiration-date"
                            placeholder="MM/YY"
                        />
                    </div>
                    <div>
                        <label htmlFor="cvv">CVV</label>
                        <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            placeholder="123"
                        />
                    </div>
                </div>
            </div>

            <div className="summary">
                <div className="summary-item">
                    <span>Subtotal</span>
                    <span>${orderSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                    <span>Shipping</span>
                    <span>${orderSummary.shipping.toFixed(2)}</span>
                </div>
                <div className="summary-item total">
                    <span>Total</span>
                    <span>${orderSummary.total.toFixed(2)}</span>
                </div>
            </div>

            <button className="purchase-button" onClick={handlePurchase}>
                Purchase - ${orderSummary.total.toFixed(2)}
            </button>
        </div>
    );
}

export default CheckoutPage;