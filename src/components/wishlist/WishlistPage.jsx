import React, { useState, useEffect } from 'react';
import './WishlistPage.css';
import Footer from '../footer/Footer';

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
        try {
            const response = await fetch('./backend/update_wishlist.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'remove_book', bookId }),
            });
            const data = await response.json();
            if (data.success) {
                setWishlistItems(wishlistItems.filter((item) => item.id !== bookId));
            } else {
                console.error('Failed to remove book:', data.message);
            }
        } catch (error) {
            console.error('Error removing book:', error);
        }
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
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
}

export default WishlistPage;
