import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { api } from '../services/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  
  // Initialize from LocalStorage or empty, filtering out any malformed items
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localCart = localStorage.getItem('cartItems');
      const parsed = localCart ? JSON.parse(localCart) : [];
      return Array.isArray(parsed) ? parsed.filter(item => item && item.product && item.product._id) : [];
    } catch (e) {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);

  // Sync with LocalStorage whenever local cart changes
  useEffect(() => {
    const cleanCart = cartItems.filter(item => item && item.product && item.product._id);
    localStorage.setItem('cartItems', JSON.stringify(cleanCart));
  }, [cartItems]);

  // Load cart from server when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      const activeToken = token || localStorage.getItem('token') || localStorage.getItem('sh_token');
      if (user && activeToken) {
        setLoading(true);
        const { ok, data } = await api.cart.getCart(activeToken);
        if (ok && data.cartItems) {
          const formattedItems = data.cartItems
            .filter(item => item.product != null)
            .map((item) => ({
              product: item.product,
              qty: item.qty,
            }));

          // Smart merge: if local cart has items, merge them, otherwise use server cart
          if (cartItems.length > 0) {
            const merged = [...cartItems];
            formattedItems.forEach((serverItem) => {
              const exist = merged.find(i => i.product._id === serverItem.product._id);
              if (!exist) {
                merged.push(serverItem);
              }
            });
            setCartItems(merged);
            syncCartWithServer(merged);
          } else {
            setCartItems(formattedItems);
          }
        }
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, token]);

  // Sync local cart with server
  const syncCartWithServer = async (items) => {
    const activeToken = token || localStorage.getItem('token') || localStorage.getItem('sh_token');
    if (user && activeToken) {
      const cleanItems = items.filter(item => item && item.product && item.product._id);
      const bodyItems = cleanItems.map(item => ({
        product: item.product._id,
        qty: item.qty
      }));
      await api.cart.saveCart(activeToken, bodyItems);
    }
  };

  const addToCart = (product, qty = 1) => {
    if (!product || !product._id) return;
    const exist = cartItems.find((x) => x.product && x.product._id === product._id);
    let updatedCart;

    if (exist) {
      updatedCart = cartItems.map((x) =>
        x.product && x.product._id === product._id ? { ...x, qty: x.qty + qty } : x
      );
    } else {
      updatedCart = [...cartItems, { product, qty }];
    }

    const cleanCart = updatedCart.filter(item => item && item.product && item.product._id);
    setCartItems(cleanCart);
    syncCartWithServer(cleanCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter((x) => x.product && x.product._id !== productId);
    setCartItems(updatedCart);
    syncCartWithServer(updatedCart);
  };

  const updateQty = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    const updatedCart = cartItems.map((x) =>
      x.product && x.product._id === productId ? { ...x, qty: Number(qty) } : x
    );
    setCartItems(updatedCart);
    syncCartWithServer(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
    syncCartWithServer([]);
  };

  // Math Calculations (safe from undefined items or products)
  const itemsPrice = cartItems.reduce((acc, item) => {
    if (item && item.product && typeof item.product.price === 'number') {
      return acc + item.product.price * item.qty;
    }
    return acc;
  }, 0);
  const shippingPrice = itemsPrice > 50 || itemsPrice === 0 ? 0 : 4.99; // Free shipping above $50
  const taxPrice = itemsPrice * 0.08; // 8% sales tax
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        itemsPrice: parseFloat(itemsPrice.toFixed(2)),
        shippingPrice: parseFloat(shippingPrice.toFixed(2)),
        taxPrice: parseFloat(taxPrice.toFixed(2)),
        totalPrice: parseFloat(totalPrice.toFixed(2)),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
