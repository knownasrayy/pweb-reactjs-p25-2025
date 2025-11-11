import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTransactionById } from '../services/apiService';
import type { Transaction } from '../types';
import styles from './TransactionDetailPage.module.css';

const TransactionDetailPage = () => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;
    const fetchTransaction = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getTransactionById(id);
        setTransaction(response.data.data);
      } catch (err) {
        setError('Gagal mengambil detail transaksi.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransaction();
  }, [id]);

  if (isLoading) return <p className={styles.pageContainer}>Loading...</p>;
  if (error) return <p className={`${styles.pageContainer} ${styles.errorText}`}>{error}</p>;
  if (!transaction) return <p className={styles.pageContainer}>Transaksi tidak ditemukan.</p>;

  return (
    <div className={styles.pageContainer}>
      <Link to="/transactions" className={styles.backLink}>
        {"< Kembali ke Riwayat Transaksi"}
      </Link>
      
      <h1 className={styles.header}>Detail Transaksi: {transaction.id}</h1>
      
      <div className={styles.summary}>
        <p><strong>Tanggal:</strong> {new Date(transaction.createdAt).toLocaleString('id-ID')}</p>
        <p><strong>Total:</strong> <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Rp {transaction.totalAmount.toLocaleString('id-ID')}</span></p>
      </div>
      
      <h2 className={styles.itemsHeader}>Item yang Dibeli:</h2>
      
      {transaction.transactionItems.map(item => (
        <div key={item.id} className={styles.itemCard}>
          <p><strong>Buku:</strong> {item.book.title}</p>
          <p><strong>Jumlah:</strong> {item.quantity}</p>
          <p><strong>Harga Satuan:</strong> Rp {item.priceAtBuy.toLocaleString('id-ID')}</p>
          <p className={styles.subtotal}><strong>Subtotal:</strong> Rp {(item.quantity * item.priceAtBuy).toLocaleString('id-ID')}</p>
        </div>
      ))}
    </div>
  );
};

export default TransactionDetailPage;