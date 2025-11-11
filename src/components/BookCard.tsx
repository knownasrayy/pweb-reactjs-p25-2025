import React from 'react';
import type { Book } from '../types';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './BookCard.module.css';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    addItem(book, e);
  };

  return (
    <div className={styles.card}>
      <Link to={`/books/${book.id}`} className={styles.imageContainer}>
        {book.image_url ? (
          <img src={book.image_url} alt={book.title} className={styles.bookImage} />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span>{book.title}</span>
          </div>
        )}
      </Link>
      <div className={styles.cardContent}>
        <Link to={`/books/${book.id}`} className={styles.titleLink}>
          <h3 className={styles.title}>{book.title}</h3>
        </Link>
        <p className={styles.writer}>{book.writer}</p>
        <p className={styles.price}>Rp {book.price.toLocaleString('id-ID')}</p>
        <button onClick={handleAddToCart} className={styles.cartButton}>
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
};

export default BookCard;