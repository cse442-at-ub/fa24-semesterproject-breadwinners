import React, { useState, useEffect } from 'react';
import './WishlistPage.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton';

function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [error, setError] = useState(null);

    // Fetch wishlist items from backend PHP when the component mounts
    const fetchWishlistItems = async () => {
        try {
            const response = await fetch('./backend/fetch_wishlist.php', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data.success) {
                setWishlistItems(data.items);
            } else {
                setError('Failed to fetch wishlist items.');
                console.error('Error:', data.message);
            }
        } catch (error) {
            setError('Error fetching wishlist items.');
            console.error('Error fetching wishlist items:', error);
        }
    };

    useEffect(() => {
        fetchWishlistItems();
    }, []);

    // Function to remove a book from the wishlist
    const removeBookFromWishlist = async (bookId) => {
   
    };

    const handleAddToCart = async (bookId, bookTitle) => {
    };


    return (
        <div className="wishlist-page">
            <h1 className="wishlist-header">Your Wishlist</h1>
            <hr className="header-line-break" />

            {error && <p className="error-message">{error}</p>}

            <p>{wishlistItems.length} item{wishlistItems.length !== 1 && 's'} in your wishlist.</p>
            <div className="wishlist-items">
                {wishlistItems.map((item) => (
                    <div key={item.id} className="wishlist-item">
                        <img src={item.image_url} alt={item.title} className="wishlist-item-image" />
                        <div className="wishlist-item-details">
                            <p className="wishlist-item-title">{item.title}</p>
                            <p>{item.author}</p>
                            <p className="wishlist-item-genre">{item.genre}</p>
                            <p className="wishlist-item-price">${item.price}</p>
                        </div>
                        <button onClick={() => removeBookFromWishlist(item.id)} className="remove-button">
                            🗑️
                        </button>
                        <IconButton 
                            onClick={() => handleAddToCart(item.id, item.title)} 
                            color="primary" 
                            aria-label="add to shopping cart" 
                            className="cart-icon"
                        >
                            <ShoppingCartIcon />
                        </IconButton>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WishlistPage;
