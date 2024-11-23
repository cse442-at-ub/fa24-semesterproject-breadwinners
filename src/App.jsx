import { useState } from 'react';
import './App.css';
import HomePage from './components/home-page/HomePage';
import LandingPage from './components/landing-page/landing-page';
import RecentPurchase from './components/recent-purchase/recent-purchase';
import SellerDashboard from './components/seller-dashboard/seller-dashboard';
import Settings from './components/settings/settings';
import ShoppingCart from './components/shopping-cart/CartPage';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/Login/LoginPage';
import CheckoutPage from './components/checkout-page/checkoutPage';
import RegisterPage from './components/Register/RegisterPage';
import WishlistPage from './components/wishlist/WishlistPage'; // Import WishlistPage
import AddBook from './components/seller-dashboard/add_book';
import DataGridPage from './components/home-page/dataGridPage';
import BookPage from './components/book-page/BookPage';
import GuestBookPage from './components/book-page/guest_BookPage';
import UserReviewHistory from './components/user-review-history/UserReviewHistory'; // Import UserReviewHistory

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/Homepage" element={<HomePage />} />
          <Route path="/recent-purchase" element={<RecentPurchase />} />
          <Route path="/shopping-cart" element={<ShoppingCart />} />
          <Route path="/wishlist" element={<WishlistPage />} /> {/* New Route for WishlistPage */}
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/book/:id" element={<BookPage />} /> {/* Route for BookPage */}
          <Route path="/guest_book/:id" element={<GuestBookPage />} />
          <Route path="/add-book" element={<AddBook />} />
          <Route path="/dataGridPage" element={<DataGridPage />} />
          <Route path="/checkout-page" element={<CheckoutPage />} />
          <Route path="/user-review-history" element={<UserReviewHistory />} /> {/* Route for UserReviewHistory */}
        </Routes>
      </div>
    </Router>
  )
}

export default App;