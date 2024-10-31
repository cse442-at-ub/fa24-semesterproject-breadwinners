import React, { useState } from "react";
import DOMPurify from "dompurify";
import "./add_book.css";

export default function AddBook() {
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "Fiction",
    price: "",
    stock: "",
    description: "" // Add description field
  });

  const [coverFile, setCoverFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSaveBook = async () => {
    try {
      // Sanitize inputs
      const sanitizedTitle = DOMPurify.sanitize(newBook.title);
      const sanitizedAuthor = DOMPurify.sanitize(newBook.author);
      const sanitizedDescription = DOMPurify.sanitize(newBook.description);

      const formData = new FormData();
      formData.append("title", sanitizedTitle);
      formData.append("author", sanitizedAuthor);
      formData.append("genre", newBook.genre);
      formData.append("price", newBook.price);
      formData.append("stock", newBook.stock);
      formData.append("description", sanitizedDescription);

      if (coverFile) {
        formData.append("cover", coverFile);
      }

      const response = await fetch("./backend/add_book.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setMessage("Book added successfully!");
        setNewBook({ title: "", author: "", genre: "Fiction", price: "", stock: "", description: "" });
        setCoverFile(null);
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
      <textarea
        placeholder="Description"
        value={newBook.description}
        onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
      />
      <input
        type="text"
        inputMode="numeric"
        placeholder="Price"
        value={newBook.price}
        onChange={(e) => {
          if (!isNaN(e.target.value) && Number(e.target.value) >= 0) {
            setNewBook({ ...newBook, price: e.target.value });
          }
        }}
      />
      <input
        type="text"
        inputMode="numeric"
        placeholder="Stock"
        value={newBook.stock}
        onChange={(e) => {
          if (!isNaN(e.target.value) && Number(e.target.value) >= 0) {
            setNewBook({ ...newBook, stock: e.target.value });
          }
        }}
      />
      <label>
        Cover:
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCoverFile(e.target.files[0])}
        />
      </label>
      <button onClick={handleSaveBook}>Save Book</button>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
