import React, { useState, useEffect } from 'react';
import './CartPage.css';

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [email, setEmail] = useState(''); // Hardcoded for now, can be set dynamically

    // Function to calculate the total cost
    const calculateTotalCost = (items) => {
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalCost(total);
    };

    // Fetch cart data from backend PHP when the component mounts
    const fetchCartItems = async () => {
        try {
            const response = await fetch('./shopping_cart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
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
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    // Function to update the quantity in the database by duplicating book titles
    const updateQuantityInDB = async (title, newQuantity) => {
        try {
            const response = await fetch('./shopping_cart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'update_quantity', email, title, quantity: newQuantity }),
            });
            const data = await response.json();
            if (data.success) {
                console.log('Quantity updated successfully');
            } else {
                console.error('Failed to update quantity:', data.message);
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    // Function to handle quantity change
    const handleQuantityChange = (index, newQuantity) => {
        const updatedItems = [...cartItems];
        const updatedItem = { ...updatedItems[index], quantity: newQuantity };
        updatedItems[index] = updatedItem;

        setCartItems(updatedItems);
        calculateTotalCost(updatedItems);

        // Call the function to update the database
        updateQuantityInDB(updatedItem.title, newQuantity);
    };

    // Function to remove a book from the database
    const removeBookFromCart = async (title) => {
        try {
            const response = await fetch('./shopping_cart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'remove_book', email, title }),
            });
            const data = await response.json();
            if (data.success) {
                console.log('Book removed successfully');
            } else {
                console.error('Failed to remove book:', data.message);
            }
        } catch (error) {
            console.error('Error removing book:', error);
        }
    };

    // Function to handle item removal
    const handleRemoveItem = (index) => {
        const updatedItems = cartItems.filter((_, i) => i !== index);
        const bookTitle = cartItems[index].title;

        setCartItems(updatedItems);
        calculateTotalCost(updatedItems);

        // Call the function to remove the book from the database
        removeBookFromCart(bookTitle);
    };

    return (
        <div className="shopping-cart-page">
            {/* Add the BREADWINNERS header */}
            <h1 className="breadwinners-header">BREADWINNERS</h1>
            {/* Line Break After the Header */}
            <hr className="header-line-break" />

            <p>{cartItems.length} item{cartItems.length !== 1 && 's'} in your cart.</p>
            <div className="shopping-cart-items">
                {cartItems.map((item, index) => (
                    <div key={index} className="cart-item">
                        <img src={item.image_url} alt={item.title} className="cart-item-image" />
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
