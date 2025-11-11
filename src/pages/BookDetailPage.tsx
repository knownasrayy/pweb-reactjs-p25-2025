import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBookById, deleteBook } from '../services/apiService';
import type { Book } from '../types';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import styles from './BookDetailPage.module.css';

const BookDetailPage = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dispatch } = useCart();

  useEffect(() => {
    if (!id) {
      navigate('/books');
      return;
    }

    const fetchBook = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getBookById(id);
        setBook(response.data.data);
      } catch (err) {
        setError('Gagal mengambil data buku.');
        if (axios.isAxiosError(err) && err.response && err.response.status === 404) {
          setError('Buku tidak ditemukan.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus buku ini?');
    if (confirmDelete) {
      try {
        await deleteBook(id);
        navigate('/books');
      } catch (err) {
        setError('Gagal menghapus buku.');
      }
    }
  };

  const handleAddToCart = () => {
    if (book) {
      dispatch({ type: 'ADD_ITEM', payload: book });
    }
  };

  if (isLoading) return <p className={styles.pageContainer}>Loading...</p>;
  if (error) return <p className={`${styles.pageContainer} ${styles.errorText}`}>{error}</p>;
  if (!book) return <p className={styles.pageContainer}>Buku tidak ditemukan.</p>;

  return (
    <div className={styles.pageContainer}>
      <Link to="/books" className={styles.backLink}>
        {"< Kembali ke Daftar Buku"}
      </Link>
      
      <div className={styles.gridContainer}>
        <div className={styles.imageWrapper}>
          {book.image_url ? (
            <img src={book.image_url} alt={book.title} className={styles.bookImage} />
          ) : (
            <div className={styles.imagePlaceholder}>
              <span>{book.title}</span>
            </div>
          )}
        </div>

        <div className={styles.detailsWrapper}>
          <h1 className={styles.title}>{book.title}</h1>
          <p className={styles.writer}>oleh {book.writer}</p>
          <p className={styles.price}>Rp {book.price.toLocaleString('id-ID')}</p>
          
          <ul className={styles.detailList}>
            <li className={styles.detailItem}><strong>Penerbit:</strong> {book.publisher || '-'}</li>
            <li className={styles.detailItem}><strong>Tahun Terbit:</strong> {book.publicationYear || '-'}</li>
            <li className={styles.detailItem}><strong>Genre:</strong> {book.genre.name}</li>
            <li className={styles.detailItem}><strong>Kondisi:</strong> {book.condition || '-'}</li>
            <li className={styles.detailItem}><strong>ISBN:</strong> {book.isbn || '-'}</li>
            <li className={styles.detailItem}><strong>Stok:</strong> {book.stockQuantity}</li>
          </ul>
          
          <h3 className={styles.descriptionHeader}>Deskripsi:</h3>
          <p className={styles.descriptionBody}>{book.description || 'Tidak ada deskripsi.'}</p>

          <div className={styles.buttonContainer}>
            <button onClick={handleAddToCart} className={styles.cartButton}>
              Tambah ke Keranjang
            </button>
            <button onClick={handleDelete} className={styles.deleteButton}>
              Hapus Buku
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;