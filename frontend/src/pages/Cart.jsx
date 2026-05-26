import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingCart } from 'lucide-react';

const Cart = () => {
  const { cartItems, updateQty, removeFromCart, itemsPrice, shippingPrice, taxPrice, totalPrice } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (user) {
      navigate('/checkout');
    } else {
      // Redirect to login page, but remember to redirect to checkout after successful sign in
      navigate('/login?redirect=checkout');
    }
  };

  const totalCartQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left dark:grad-bg min-h-screen">
      
      <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
        <ShoppingCart className="w-7 h-7 text-purple-500" />
        <span>Shopping Cart</span>
      </h1>
      <p className="text-xs text-slate-400 mb-8">
        You have <span className="text-purple-500 font-bold">{totalCartQty}</span> premium stationery item(s) selected.
      </p>

      {cartItems.length === 0 ? (
        /* Empty Cart Illustration Panel */
        <div className="glass rounded-3xl p-12 border border-slate-200/50 dark:border-slate-800/40 text-center max-w-2xl mx-auto flex flex-col items-center gap-4 py-16 animate-fade-in-up">
          <div className="p-5 bg-gradient-to-tr from-blue-500/10 to-purple-600/10 text-purple-500 rounded-full border border-purple-500/20">
            <ShoppingCart className="w-12 h-12" />
          </div>
          
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-2">Your Shopping Cart is Empty</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
            A aesthetic workspace requires premium stationery! Explore our catalog and populate your cart with notebooks, pens, and art sets.
          </p>

          <Link
            to="/products"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-black shadow-lg shadow-purple-500/20 hover:opacity-95 transition-transform hover:scale-[1.02] active:scale-[0.98] mt-2 inline-flex items-center gap-1 glow-btn"
          >
            <span>Explore Stationery Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Active Cart Layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Cart items list */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cartItems.map((item) => (
              <div
                key={item.product._id}
                className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4 rounded-2xl glass bg-white/70 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-850 hover:shadow-md transition-shadow"
              >
                
                {/* Product spec summary */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-20 h-20 rounded-xl overflow-hidden glass border border-slate-200 dark:border-slate-800 flex-shrink-0">
                    <img
                      src={item.product.images && item.product.images[0] ? item.product.images[0] : 'https://images.unsplash.com/photo-1586075010923-2dd45e9b2d4f?q=80&w=600'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="text-left flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.product.brand}</span>
                    <Link to={`/product/${item.product._id}`} className="hover:text-purple-500 transition-colors">
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                        {item.product.name}
                      </h3>
                    </Link>
                    <span className="text-[10px] text-purple-500 font-bold bg-purple-500/10 px-2 py-0.5 rounded-md w-fit border border-purple-500/10">{item.product.category}</span>
                  </div>
                </div>

                {/* Right side controls: pricing, quantities, trash */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-850">
                  
                  {/* Item unit price */}
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Price</span>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      ${item.product.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity adjustment */}
                  <div className="flex items-center gap-1.5 p-1 rounded-xl border border-slate-250 dark:border-slate-800">
                    <button
                      onClick={() => updateQty(item.product._id, item.qty - 1)}
                      className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-slate-850 dark:text-white">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.product._id, item.qty + 1)}
                      disabled={item.qty >= item.product.stock}
                      className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 disabled:opacity-30"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Product total cost */}
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Total</span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      ${(item.product.price * item.qty).toFixed(2)}
                    </span>
                  </div>

                  {/* Delete trigger */}
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/10"
                    aria-label="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>

              </div>
            ))}
          </div>

          {/* Right Column: Checkout Summary block */}
          <div className="flex flex-col gap-6 p-6 rounded-2xl glass bg-white/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/40">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-3 border-b border-slate-200/50 dark:border-slate-800/40">Cart Summary</span>
            
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>Sales Tax (8%)</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">${taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 font-medium">
                <span>Shipping Delivery</span>
                {shippingPrice === 0 ? (
                  <span className="text-emerald-500 font-extrabold uppercase text-[10px]">Free Delivery</span>
                ) : (
                  <span className="text-slate-800 dark:text-slate-250">${shippingPrice.toFixed(2)}</span>
                )}
              </div>
              
              <hr className="border-slate-200 dark:border-slate-850 my-1" />

              <div className="flex justify-between items-center text-sm font-black text-slate-900 dark:text-white">
                <span>Grand Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Reassurance text */}
            {itemsPrice < 50 && (
              <span className="text-[10px] text-amber-500 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 leading-relaxed font-semibold">
                Spend <span className="font-black">${(50 - itemsPrice).toFixed(2)}</span> more to unlock Free Standard Delivery!
              </span>
            )}

            {/* Checkout Action */}
            <button
              onClick={handleCheckout}
              className="flex items-center justify-center gap-1.5 w-full py-3.5 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-95 shadow-lg active:scale-[0.98] glow-btn"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Security seals */}
            <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase mt-2">
              <ShieldCheck className="w-4 h-4 text-purple-500" />
              <span>Checkout security encrypted</span>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Cart;
