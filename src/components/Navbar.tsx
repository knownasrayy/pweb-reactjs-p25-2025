import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';
import React, { useRef, useEffect } from 'react';

const Navbar = () => {
  const { state: cartState, setCartIconRef } = useCart();
  const { user, logout } = useAuth();
  const cartLinkRef = useRef<HTMLAnchorElement>(null);

  
  useEffect(() => {
    if (cartLinkRef.current) {
      setCartIconRef(cartLinkRef.current);
    }
  }, [cartLinkRef, setCartIconRef]);

  const cartItemCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

  return (
    <nav className={styles.navbar}>
      <NavLink to="/books" className={getNavLinkClass}>
        Buku
      </NavLink>
      <NavLink to="/transactions" className={getNavLinkClass}>
        Transaksi
      </NavLink>
      
      {/* Pasang ref ke link Keranjang */}
      <NavLink 
        to="/cart" 
        className={getNavLinkClass} 
        ref={cartLinkRef}
      >
        Keranjang ({cartItemCount})
      </NavLink>
      
      {user ? (
        <div className={styles.userInfo}>
          <span className={styles.email}>{user.email}</span>
          <button onClick={logout} className={styles.logoutButton}>Logout</button>
        </div>
      ) : (
        <div className={styles.userInfo}>
          <NavLink to="/login" className={styles.navLink}>Login</NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;