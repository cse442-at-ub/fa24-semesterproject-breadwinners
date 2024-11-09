import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DOMPurify from 'dompurify';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './BookPage.css';

export default function BookPage() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [shareLink, setShareLink] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [message, setMessage] = useState(''); // Add message state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookById = async () => {
            try {
                const response = await fetch(`./backend/FetchBookById.php?id=${id}`);
                const data = await response.json();
                if (data.success) {
                    setBook(data.book);
                } else {
                    setError(data.message);
                }
            } catch (error) {
                setError('An error occurred while fetching book details.');
            }
        };

        const checkWishlist = async () => {
            try {
                const response = await fetch(`./backend/CheckWishlist.php?id=${id}`);
                const data = await response.json();
                setIsBookmarked(data.isBookmarked);
            } catch (error) {
                console.error('Error checking wishlist:', error);
            }
        };

        fetchBookById();
        checkWishlist();
    }, [id]);

    const handleBookmarkToggle = async () => {
        try {
            const response = await fetch('./backend/AddToWishlist.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });
            const data = await response.json();
            if (data.success) {
                setIsBookmarked((prev) => !prev);
            } else {
                console.error("Failed to toggle wishlist:", data.message);
            }
        } catch (error) {
            console.error("Error toggling wishlist:", error);
        }
    };

    const handleShare = () => {
        const baseLink = `${window.location.origin}${window.location.pathname}`;
        const link = `${baseLink}#/guest_book/${id}`;
        setShareLink(link);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareLink).then(() => {
            setMessage(DOMPurify.sanitize('Link copied to clipboard!'));
        });
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSendEmail = async () => {
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address.');
            return;
        }

        setEmailError(''); // Clear any previous error message

        try {
            const response = await fetch('./backend/SendRecommendationEmail.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, link: shareLink }),
            });
            const data = await response.json();
            if (data.success) {
                setMessage(DOMPurify.sanitize("Recommendation sent!"));
                setEmail(''); // Clear the email field
            } else {
                setMessage(DOMPurify.sanitize(`Failed to send recommendation: ${data.message}`));
            }
        } catch (error) {
            console.error("Error sending email:", error);
            setMessage(DOMPurify.sanitize("An error occurred while sending the email."));
        }
    };

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!book) {
        return <div>Loading...</div>;
    }

    const imageUrl = `./${book.image_url}`;
    const sanitizedTitle = DOMPurify.sanitize(book.title);
    const sanitizedAuthor = DOMPurify.sanitize(book.author);
    const sanitizedGenre = DOMPurify.sanitize(book.genre);
    const sanitizedDescription = DOMPurify.sanitize(book.description);

    return (
        <div className="book-page">
            <header className="header-bar">
                <h1 className="logo">BREADWINNERS</h1>
            </header>
            <div className="book-details-container">
                <div className="book-details">
                    <div className="image-bookmark">
                        <img src={imageUrl} alt={sanitizedTitle} className="book-cover" />
                        <IconButton color="primary" aria-label="bookmark this book" className="bookmark-icon" onClick={handleBookmarkToggle}>
                            {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                        </IconButton>
                    </div>
                    <div className="info-section">
                        <h2 className="title-author">{`${sanitizedTitle} by ${sanitizedAuthor}`}</h2>
                        <div className="rating">
                            <span className="rating-label">Rating:</span>
                            <span className="stars">{'⭐'.repeat(Math.floor(book.rating))}</span>
                        </div>
                        <div className="genre">
                            <span>Genre:</span> {sanitizedGenre}
                        </div>
                        <p className="description-label">Description:</p>
                        <p className="description">{sanitizedDescription}</p>
                    </div>
                </div>
                <IconButton color="primary" aria-label="add to shopping cart" className="cart-icon">
                    <ShoppingCartIcon />
                </IconButton>
                
                <IconButton color="primary" aria-label="share this book" onClick={handleShare}>
                    <ShareIcon />
                </IconButton>

                {/* Share Options Displayed Inline */}
                {shareLink && (
                    <div className="share-options">
                        <p className="share-link">Share Link: {shareLink}</p> {/* Display the share link */}
                        <Button variant="contained" color="primary" onClick={handleCopyLink} style={{ marginBottom: '10px' }}>Copy Link</Button>
                        <TextField
                            label="Enter email to send recommendation"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            size="small"
                            style={{ marginBottom: '10px' }}
                            error={!!emailError}
                            helperText={emailError}
                        />
                        <Button variant="contained" color="secondary" onClick={handleSendEmail}>Send Email</Button>
                    </div>
                )}
                
                {/* Display Message */}
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
}
