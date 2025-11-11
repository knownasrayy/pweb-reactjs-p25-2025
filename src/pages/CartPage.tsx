import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { createTransaction } from '../services/apiService';
import { useNavigate, Link } from 'react-router-dom';
import CartItemCard from '../components/CartItemCard';
import styles from './CartPage.module.css';

const CartPage = () => {
  const { state, dispatch } = useCart();
  const { items } = state;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  const shipping = 0; // Sesuai permintaan
  const totalAmount = subtotal + shipping;

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);
    
    const transactionItems = items.map(item => ({
      bookId: item.book.id,
      quantity: item.quantity,
    }));

    try {
      await createTransaction({ items: transactionItems });
      dispatch({ type: 'CLEAR_CART' });
      navigate('/transactions');
    } catch (err) {
      setError('Checkout gagal. Stok buku mungkin tidak mencukupi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.gridContainer}>
        <div className={styles.cartItems}>
          <h1 className={styles.cartHeader}>Keranjang Belanja</h1>
          
          <div className={styles.cartTableHead}>
            <span>Product</span>
            <span>Quantity</span>
            <span className={styles.tableHeadPrice}>Total Price</span>
            <span></span>
          </div>
          
          {items.length === 0 ? (
            <p>Keranjang Anda kosong.</p>
          ) : (
            <div>
              {items.map(item => (
                <CartItemCard key={item.book.id} item={item} />
              ))}
            </div>
          )}
          <Link to="/books" className={styles.continueShopping}>
            &larr; Lanjut Belanja
          </Link>
        </div>

        <div className={styles.summaryCard}>
          <span className={styles.summaryIcon}>🛒</span>
          <p className={styles.summaryMessage}>
            Terima kasih telah berbelanja di IT Literature Shop!
          </p>
          <div className={styles.summaryDetails}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Rp {shipping.toLocaleString('id-ID')}</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>
          <button 
            onClick={handleCheckout} 
            disabled={isLoading || items.length === 0}
            className={styles.checkoutButton}
          >
            {isLoading ? 'Memproses...' : 'Checkout Sekarang'}
          </button>
          {error && <p className={styles.errorText}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default CartPage;