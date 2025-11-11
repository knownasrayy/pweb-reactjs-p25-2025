import React from 'react';
import type { CartItem } from '../context/CartContext';
import { useCart } from '../context/CartContext';
import styles from './CartItemCard.module.css';

interface CartItemProps {
  item: CartItem;
}

const CartItemCard: React.FC<CartItemProps> = ({ item }) => {
  const { dispatch } = useCart();
  const { book, quantity } = item;
  
  const totalItemPrice = (book.price * quantity).toLocaleString('id-ID');

  return (
    <div className={styles.itemContainer}>
      <div className={styles.productDetails}>
        {book.image_url ? (
          <img src={book.image_url} alt={book.title} className={styles.bookImage} />
        ) : (
          <div className={styles.imagePlaceholder}>📚</div>
        )}
        <div>
          <h3 className={styles.title}>{book.title}</h3>
          <p className={styles.writer}>{book.writer}</p>
        </div>
      </div>

      <div className={styles.quantityControl}>
        <button onClick={() => dispatch({ type: 'DECREASE_ITEM', payload: book.id })}>-</button>
        <span>{quantity}</span>
        <button onClick={() => dispatch({ type: 'INCREASE_ITEM', payload: book.id })}>+</button>
      </div>

      <div className={styles.price}>
        <span>Rp {totalItemPrice}</span>
      </div>

      <button className={styles.removeButton} onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: book.id })}>
        &times;
      </button>
    </div>
  );
};

export default CartItemCard;