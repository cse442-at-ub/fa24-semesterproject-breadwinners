import React, { useState, useEffect } from 'react';
import './CartPage.css';
import { useNavigate } from 'react-router-dom';

function CartPage() {
    const navigate = useNavigate();
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
            });

            const data = await response.json(); // Expecting JSON response

            console.log('Response data:', data); // Debugging line

            if (data.success) {
                const formattedItems = data.items.map(item => ({
                    ...item,
                    price: parseFloat(item.price) // Convert price to a number
                }));
                setCartItems(formattedItems);
                calculateTotalCost(formattedItems);
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

    const handleQuantityChange = async (index, newQuantity) => {
        const updatedItems = [...cartItems];
        updatedItems[index].quantity = newQuantity;
        setCartItems(updatedItems);
        calculateTotalCost(updatedItems);

        // Call to update quantity in backend
        await updateQuantityInBackend(updatedItems[index].book_title, newQuantity);
    };

    const handleRemoveItem = async (index) => {
        const itemToRemove = cartItems[index];

        const updatedItems = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedItems);
        calculateTotalCost(updatedItems);

        // Call to remove item from backend
        await removeItemFromBackend(itemToRemove.book_title);
    };

    const updateQuantityInBackend = async (bookTitle, newQuantity) => {
        try {
            await fetch('./backend/shopping_cart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'update', bookTitle, quantity: newQuantity }),
            });
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const removeItemFromBackend = async (bookTitle) => {
        try {
            await fetch('./backend/shopping_cart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'remove', bookTitle }),
            });
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const handleCheckout = async () => {
        // Handle checkout logic here (e.g., clear cart, process payment, etc.)
        console.log('Checkout clicked. Total cost:', totalCost);
        
        // Send checkout details to the backend
        try {
            const response = await fetch('./backend/shopping_cart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'checkout', totalPrice: totalCost }),
            });
    
            const data = await response.json();
            if (data.success) {
                console.log('Checkout successful:', data.message);
                // Optionally, clear the cart or navigate to a different page
                setCartItems([]); // Clear the cart items
                setTotalCost(0); // Reset total cost
                navigate('/checkout-page');
            } else {
                console.error('Checkout failed:', data.message);
            }
        } catch (error) {
            console.error('Error during checkout:', error);
        }
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
                            <p className="cart-item-price">${item.price.toFixed(2)}</p>
                        </div>
                        <button onClick={() => handleRemoveItem(index)} className="remove-button">
                            🗑️
                        </button>
                    </div>
                ))}
            </div>
            <div className="shopping-cart-total">
                <p>Total Cost: ${totalCost.toFixed(2)}</p>
                <button onClick={handleCheckout} className="checkout-button">Checkout</button>
            </div>
        </div>
    );
}

export default CartPage;