import React from 'react';
import type { Book } from '../types';
import { Link } from 'react-router-dom';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const cardStyle: React.CSSProperties = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    margin: '8px',
    width: '300px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '8px',
  };

  return (
    <div style={cardStyle}>
      <Link to={`/books/${book.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h3 style={titleStyle}>{book.title}</h3>
      </Link>
      <p>Penulis: {book.writer}</p>
      <p>Genre: {book.genre.name}</p>
      <p>Stok: {book.stock}</p>
      <p>Harga: Rp {book.price.toLocaleString('id-ID')}</p>
    </div>
  );
};

export default BookCard;