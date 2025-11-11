import React, { createContext, useContext, useReducer, ReactNode, useRef, useCallback } from 'react';
import type { Book } from '../types';

export interface CartItem {
  book: Book;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Book }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'INCREASE_ITEM'; payload: string }
  | { type: 'DECREASE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' };


interface CartContextType {
  state: CartState;
  setCartIconRef: (el: HTMLElement | null) => void;
  addItem: (book: Book, clickEvent: React.MouseEvent) => void;
  removeItem: (id: string) => void;
  increaseItem: (id: string) => void;
  decreaseItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);


const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        (item) => item.book.id === action.payload.id
      );
      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += 1;
        return { ...state, items: updatedItems };
      } else {
        return {
          ...state,
          items: [...state.items, { book: action.payload, quantity: 1 }],
        };
      }
    }
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((item) => item.book.id !== action.payload),
      };
    }
    case 'INCREASE_ITEM': {
      const updatedItems = state.items.map((item) =>
        item.book.id === action.payload
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      return { ...state, items: updatedItems };
    }
    case 'DECREASE_ITEM': {
      const updatedItems = state.items
        .map((item) =>
          item.book.id === action.payload
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);
      return { ...state, items: updatedItems };
    }
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
};


export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const cartIconRef = useRef<HTMLElement | null>(null);

  const setCartIconRef = useCallback((el: HTMLElement | null) => {
    cartIconRef.current = el;
  }, []);

  const flyToCart = (clickEvent: React.MouseEvent) => {
    if (!cartIconRef.current) return;

    const startRect = (clickEvent.target as HTMLElement).getBoundingClientRect();
    const endRect = cartIconRef.current.getBoundingClientRect();

    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;
    const endX = endRect.left + endRect.width / 2;
    const endY = endRect.top + endRect.height / 2;

    const flyEl = document.createElement('div');
    flyEl.className = 'fly-to-cart-element';
    flyEl.style.left = `${startX}px`;
    flyEl.style.top = `${startY}px`;

    document.body.appendChild(flyEl);

    requestAnimationFrame(() => {
      flyEl.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(0.1)`;
      flyEl.style.opacity = '0';
    });

    setTimeout(() => {
      if (document.body.contains(flyEl)) {
        document.body.removeChild(flyEl);
      }
    }, 700);
  };

  const addItem = (book: Book, clickEvent: React.MouseEvent) => {
    dispatch({ type: 'ADD_ITEM', payload: book });
    flyToCart(clickEvent);
  };
  
  const removeItem = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const increaseItem = (id: string) => dispatch({ type: 'INCREASE_ITEM', payload: id });
  const decreaseItem = (id: string) => dispatch({ type: 'DECREASE_ITEM', payload: id });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider 
      value={{ 
        state, 
        setCartIconRef, 
        addItem, 
        removeItem, 
        increaseItem, 
        decreaseItem, 
        clearCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};