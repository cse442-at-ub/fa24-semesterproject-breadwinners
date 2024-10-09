import React, { useState, useEffect } from 'react';
import './CartPage.css';

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [email, setEmail] = useState('');
    const [fetched, setFetched] = useState(false); // Use a flag to prevent multiple fetches

    // Function to calculate the total cost
    const calculateTotalCost = (items) => {
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalCost(total);
    };

    // Fetch cart data from backend PHP when the component mounts
    const fetchCartItems = async () => {
        if (fetched) return; // Prevent duplicate fetches
        try {
            const response = await fetch('./shopping_cart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }), // Send the user's email to the backend
            });
            const data = await response.json();
            if (data.success) {
                setCartItems(data.items);
                calculateTotalCost(data.items);
            } else {
                console.error('Failed to fetch cart items:', data.message);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
        setFetched(true); // Mark fetch as done
    };

    useEffect(() => {
        // Simulate getting the email from user state or local storage
        const storedEmail = 'chonheic@buffalo.edu'; // You can replace this with actual logic to get the logged-in user's email
        setEmail(storedEmail);
        fetchCartItems();
    }, [email]);

    // Function to handle quantity change
    const handleQuantityChange = (index, newQuantity) => {
        const updatedItems = [...cartItems];
        updatedItems[index].quantity = newQuantity;

        setCartItems(updatedItems);
        calculateTotalCost(updatedItems);
    };

    // Function to handle item removal
    const handleRemoveItem = (index) => {
        const updatedItems = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedItems);
        calculateTotalCost(updatedItems);
    };

    return (
        <div className="shopping-cart-page">
            <h2 className="shopping-cart-title">Shopping Cart: from {email}</h2>
            <p>{cartItems.length} item{cartItems.length !== 1 && 's'} in your cart.</p>
            <div className="shopping-cart-items">
                {cartItems.map((item, index) => (
                    <div key={index} className="cart-item">
                        <img src={item.image} alt={item.title} className="cart-item-image" />
                        <div className="cart-item-details">
                            <p className="cart-item-title">{item.title}</p>
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
                            <p className="cart-item-price">${item.price}</p>
                        </div>
                        <button onClick={() => handleRemoveItem(index)} className="remove-button">
                            🗑️
                        </button>
                    </div>
                ))}
            </div>
            <div className="shopping-cart-total">
                <p>Total Cost: ${totalCost}</p>
                <button className="checkout-button">Checkout</button>
            </div>
        </div>
    );
}

export default CartPage;
