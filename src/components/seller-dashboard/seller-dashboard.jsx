// NewSeller.jsx 
import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./seller-dashboard.css";

const initialRows = [
  {
    id: 1,
    image: "https://via.placeholder.com/50",
    name: "Book One",
    author: "Author A",
    genre: "Fiction",
    price: 10.99,
    stock: 100,
  },
  {
    id: 2,
    image: "https://via.placeholder.com/50",
    name: "Book Two",
    author: "Author B",
    genre: "Mystery",
    price: 12.99,
    stock: 50,
  },
  {
    id: 3,
    image: "https://via.placeholder.com/50",
    name: "Book Three",
    author: "Author C",
    genre: "Sci-Fi",
    price: 15.99,
    stock: 30,
  },
  {
    id: 4,
    image: "https://via.placeholder.com/50",
    name: "Book Four",
    author: "Author D",
    genre: "Fantasy",
    price: 9.99,
    stock: 80,
  },
  {
    id: 5,
    image: "https://via.placeholder.com/50",
    name: "Book Five",
    author: "Author E",
    genre: "Non-Fiction",
    price: 20.99,
    stock: 10,
  },
];

export default function SellerDashboard() {
  const [rowData, setRowData] = useState(initialRows);

  const columns = [
    {
      headerName: "Image",
      field: "image",
      cellRenderer: (params) => (
        <img src={params.value} alt={"Book"} width="50" />
      ),
      minWidth: 100, // Minimum width to keep the image visible
      filter: false,
    },
    {
      headerName: "Book Name",
      field: "name",
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
