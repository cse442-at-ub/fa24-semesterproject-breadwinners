// Updated NewSeller.jsx to integrate seller-specific book fetching using auth_token from cookies

import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./seller-dashboard.css";

export default function SellerDashboard() {
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    // Fetch books from the backend for the logged-in seller
    const fetchBooks = async () => {
      try {
        const response = await fetch("./backend/seller_fetch_books.php", {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (data.success) {
          setRowData(data.books);
        } else {
          console.error("Failed to fetch books: ", data.message);
        }
      } catch (error) {
        console.error("Error fetching books: ", error);
      }
    };

    fetchBooks();
  }, []);

  const columns = [
    {
      headerName: "Image",
      field: "image_url",
      cellRenderer: (params) => (
        <img src={params.value} alt={"Book"} width="50" />
      ),
      minWidth: 100, // Minimum width to keep the image visible
      filter: false,
    },
    {
      headerName: "Book Name",
      field: "title",
      filter: "agTextColumnFilter",
      floatingFilter: true,
      flex: 1, // Allows the column to flex
      minWidth: 150, // Set a minimum width
    },
    {
      headerName: "Author",
      field: "author",
      filter: "agTextColumnFilter",
      floatingFilter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Genre",
      field: "genre",
      filter: "agTextColumnFilter",
      floatingFilter: true,
      flex: 1,
      minWidth: 120,
    },
    {
      headerName: "Price ($)",
      field: "price",
      filter: "agNumberColumnFilter",
      floatingFilter: true,
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: "Stock",
      field: "stock",
      filter: "agNumberColumnFilter",
      floatingFilter: true,
      flex: 1,
      minWidth: 100,
    },
  ];

  return (
    <div className="seller-dashboard-container">
      <div className="header">
        <h2>Seller Dashboard</h2>
        <button className="add-book-btn">Add Book</button>
      </div>
      <div
        style={{ height: 400, width: "100%", overflowX: "auto" }} // Allow horizontal scrolling
        className="ag-theme-alpine data-grid"
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columns}
          defaultColDef={{
            sortable: true,
            filter: true,
            flex: 1, // Default flex for all columns
            minWidth: 100, // Ensure a default minimum width
          }}
          pagination={true}
          paginationPageSize={5}
          getRowHeight={() => 60}
        />
      </div>
    </div>
  );
}