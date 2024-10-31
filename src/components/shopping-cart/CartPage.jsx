import React, { useState, useEffect } from 'react';
import './CartPage.css';

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [totalCost, setTotalCost] = useState(0);

    // Function to calculate the total cost
    const calculateTotalCost = (items) => {
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalCost(total);
    };

    // Fetch cart data from backend PHP when the component mounts
    const fetchCartItems = async () => {
        try {
            const response = await fetch('./backend/shopping_cart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // No body needed since the email is fetched from PHP
            });

            const data = await response.json(); // Expecting JSON response

            console.log('Response data:', data); // Debugging line

            if (data.success) {
                setCartItems(data.items);
                calculateTotalCost(data.items);
            } else {
                console.error('Failed to fetch cart items:', data.message);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    useEffect(() => {
        fetchCartItems(); // Call fetchCartItems directly
    }, []);

    const handleQuantityChange = (index, newQuantity) => {
        const updatedItems = [...cartItems];
        updatedItems[index].quantity = newQuantity;
        setCartItems(updatedItems);
        calculateTotalCost(updatedItems);
    };

    const handleRemoveItem = (index) => {
        const updatedItems = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedItems);
        calculateTotalCost(updatedItems);
    };

    return (
        <div className="shopping-cart-page">
            <h1 className="breadwinners-header">BREADWINNERS</h1>
            <hr className="header-line-break" />
            <p>{cartItems.length} item{cartItems.length !== 1 && 's'} in your cart.</p>
            <div className="shopping-cart-items">
                {cartItems.map((item, index) => (
                    <div key={index} className="cart-item">
                        <img src={item.image_url} alt={item.book_title} className="cart-item-image" />
                        <div className="cart-item-details">
                            <p className="cart-item-title">{item.book_title}</p>
                            <p>{item.author}</p>
                            <div className="cart-item-quantity">
                                <label>Quantity: </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                                />
                            </div>
                            <p className="cart-item-price">${parseFloat(item.price).toFixed(2)}</p> {/* Convert to float */}
                        </div>
                        <button onClick={() => handleRemoveItem(index)} className="remove-button">
                            🗑️
                        </button>
                    </div>
                ))}
            </div>
            <div className="shopping-cart-total">
                <p>Total Cost: ${totalCost.toFixed(2)}</p>
                <button className="checkout-button">Checkout</button>
            </div>
        </div>
    );
}

export default CartPage;