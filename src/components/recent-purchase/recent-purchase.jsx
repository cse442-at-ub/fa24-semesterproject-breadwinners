import React, { useEffect, useState } from 'react';
import './recent-purchase.css';

function RecentPurchase() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('./backend/recent_purchase.php', {
      credentials: 'include', // Include cookies in the request
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setPurchases(data.purchases);
        } else {
          setError(data.message || 'Failed to fetch purchase data');
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
      <h1>Recent Purchase</h1>
      {purchases.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Total Price</th>
              <th>Purchase Date</th>
              <th>Books Purchased</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase, index) => (
              <tr key={index}>
                <td>{purchase.total_price}</td>
                <td>{new Date(purchase.created_at).toLocaleDateString()}</td>
                <td>{purchase.books_purchased}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No recent purchases found.</p>
      )}
    </div>
  );
}

export default RecentPurchase;
