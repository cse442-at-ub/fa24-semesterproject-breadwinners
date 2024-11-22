import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./seller-dashboard.css";

export default function SellerDashboard() {
  const [rowData, setRowData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("./backend/seller_fetch_books.php", {
          method: 'GET',
          credentials: 'include', // This allows sending cookies
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': getCsrfToken() // Include CSRF token in the headers
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

  const handleAddBook = () => {
    navigate("/add-book"); // Navigate to the AddBook page
  };

  const getCsrfToken = () => {
    return document.cookie.split('; ').find(row => row.startsWith('csrf_token=')).split('=')[1];
  };

  const columns = [
    {
      headerName: "Image",
      field: "image_url",
      cellRenderer: (params) => (
        <img src={params.value} alt={"Book"} width="50" />
      ),
      minWidth: 100,
      filter: false,
    },
    {
      headerName: "Book Name",
      field: "title",
      filter: "agTextColumnFilter",
      floatingFilter: true,
      flex: 1,
      minWidth: 150,
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
    {
      headerName: "Profit",
      field: "profit",
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
        <button className="add-book-btn" onClick={handleAddBook}>Add Book</button>
      </div>
      <div
        style={{ height: 400, width: "100%", overflowX: "auto" }}
        className="ag-theme-alpine data-grid"
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columns}
          defaultColDef={{
            sortable: true,
            filter: true,
            flex: 1,
            minWidth: 100,
          }}
          pagination={true}
          paginationPageSize={10}
          getRowHeight={() => 60}
        />
      </div>
    </div>
  );
}
