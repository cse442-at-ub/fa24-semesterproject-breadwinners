// src/components/add-book/AddBook.jsx
import React, { useState } from "react";
import "./add_book.css";

export default function AddBook() {
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "Fiction",
    price: "",
    stock: "",
    image_url: "",
  });

  const [message, setMessage] = useState("");

  const handleSaveBook = async () => {
    try {
      const response = await fetch("./backend/add_book.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("Book added successfully!");
        setNewBook({ title: "", author: "", genre: "Fiction", price: "", stock: "", image_url: "" });
      } else {
        setMessage(`Failed to add book: ${data.message}`);
      }
    } catch (error) {
      setMessage(`Error adding book: ${error.message}`);
    }
  };

  return (
    <div className="add-book-container">
      <h3>Add New Book</h3>
      <input
        type="text"
        placeholder="Title"
        value={newBook.title}
        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Author"
        value={newBook.author}
        onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
      />
      <select
        value={newBook.genre}
        onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
      >
        <option value="Fiction">Fiction</option>
        <option value="Non-Fiction">Non-Fiction</option>
      </select>
      <input
        type="number"
        placeholder="Price"
        value={newBook.price}
        onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
      />
      <input
        type="number"
        placeholder="Stock"
        value={newBook.stock}
        onChange={(e) => setNewBook({ ...newBook, stock: e.target.value })}
      />
      <input
        type="text"
        placeholder="Image URL"
        value={newBook.image_url}
        onChange={(e) => setNewBook({ ...newBook, image_url: e.target.value })}
      />
      <button onClick={handleSaveBook}>Save Book</button>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
