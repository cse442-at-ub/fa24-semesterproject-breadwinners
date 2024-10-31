import React, { useState } from 'react';
import './checkoutPage.css';
import { Link } from 'react-router-dom';
import MasterCard from '../../assets/mc.png'; 
import Visa from '../../assets/visa.png'; 
import Amex from '../../assets/amex.png'; 

function CheckoutPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <div className="checkout-container">
          <div className="card-details">
            <h2>Card Details</h2>

            {/* Card Type Images */}
            <div className="card-type-images">
              <img src={MasterCard} alt="MasterCard" />
              <img src={Visa} alt="Visa" />
              <img src={Amex} alt="American Express" />
              <button className="see-all-button">See All</button>
            </div>
    
            {/* Name on Card */}
            <label htmlFor="name-on-card">Name on Card</label>
            <input
              type="text"
              id="name-on-card"
              name="name-on-card"
              placeholder="John Doe"
            />
    
            {/* Card Number */}
            <label htmlFor="card-number">Card Number</label>
            <input
              type="text"
              id="card-number"
              name="card-number"
              placeholder="1234 5678 9123 4567"
            />
    
            {/* Expiration Date and CVV */}
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
    
          {/* Summary */}
          <div className="summary">
            <div className="summary-item">
              <span>Subtotal</span>
              <span>$100.00</span>
            </div>
            <div className="summary-item">
              <span>Shipping</span>
              <span>$10.00</span>
            </div>
            <div className="summary-item total">
              <span>Total</span>
              <span>$110.00</span>
            </div>
          </div>
    
          {/* Purchase Button */}
          <button className="purchase-button">Purchase - $110.00</button>
        </div>
      );

}

export default CheckoutPage;