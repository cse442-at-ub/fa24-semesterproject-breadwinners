import React, { useEffect, useState } from 'react';
import './user-review-history.css';

function UserReviewHistory() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('./backend/UserReviewHistory.php', {
      credentials: 'include', // Include cookies in the request
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setReviews(data.reviews);
        } else {
          setError(data.message || 'Failed to fetch review history');
        }
        setLoading(false);
      })
      .catch(err => {
        setError('An error occurred while fetching data');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Your Review History</h1>
      {reviews.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Review</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review, index) => (
              <tr key={index}>
                <td>{review.book_title}</td>
                <td>{review.review}</td>
                <td>{new Date(review.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You haven't posted any reviews yet.</p>
      )}
    </div>
  );
}

export default UserReviewHistory;
