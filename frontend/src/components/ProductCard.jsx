import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Check } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import Rating from './Rating';

const ProductCard = ({ product }) => {
  const { toggleWishlist, isInWishlist, user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);

  const favorited = isInWishlist(product._id);

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 500);
    await toggleWishlist(product._id);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Safe category tag styling
  const categoryColors = {
    'Notebooks': 'from-blue-500/10 to-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    'Pens': 'from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400',
    'Pencils': 'from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400',
    'Markers': 'from-teal-500/10 to-emerald-500/10 text-teal-600 dark:text-teal-400',
    'Sticky Notes': 'from-rose-500/10 to-pink-500/10 text-rose-600 dark:text-rose-400',
    'Files': 'from-sky-500/10 to-cyan-500/10 text-sky-600 dark:text-sky-400',
    'School Bags': 'from-violet-500/10 to-purple-500/10 text-violet-600 dark:text-violet-400',
    'Art Supplies': 'from-fuchsia-500/10 to-purple-500/10 text-fuchsia-600 dark:text-fuchsia-400',
  };

  const catStyle = categoryColors[product.category] || 'from-slate-500/10 to-slate-600/10 text-slate-600';

  return (
    <div className="group relative flex flex-col justify-between w-full h-[400px] rounded-2xl transition-all duration-500 border border-slate-200/50 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/40 glass hover:scale-[1.01] hover:shadow-xl hover:shadow-purple-500/5">
      
      {/* Product Image & Wishlist Button */}
      <Link to={`/product/${product._id}`} className="block relative h-48 w-full overflow-hidden rounded-t-2xl">
        <img
          src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1586075010923-2dd45e9b2d4f?q=80&w=600'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Category Badge */}
        <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${catStyle} shadow-sm border border-white/10`}>
          {product.category}
        </span>

        {/* Wishlist Icon */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-md ${
            favorited 
              ? 'bg-rose-500 text-white hover:bg-rose-600' 
              : 'bg-white/70 dark:bg-slate-950/60 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900'
          } ${heartAnim ? 'scale-125' : ''}`}
          aria-label="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>

        {/* Stock Status Indicator */}
        {product.stock <= 0 ? (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="text-white text-xs font-black uppercase tracking-wider bg-rose-600 px-3 py-1 rounded-full shadow-lg">
              Out of Stock
            </span>
          </div>
        ) : product.stock <= 5 ? (
          <span className="absolute bottom-2 left-2 text-[9px] font-bold text-amber-500 bg-amber-500/10 backdrop-blur-md px-2 py-0.5 rounded-md border border-amber-500/20">
            Only {product.stock} left
          </span>
        ) : null}
      </Link>

      {/* Info Block */}
      <div className="flex flex-col gap-2 p-4 flex-grow justify-between">
        
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.brand}</span>
          <Link to={`/product/${product._id}`} className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors">
            <h3 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100 line-clamp-2 h-10">
              {product.name}
            </h3>
          </Link>
          
          <Rating value={product.ratings} text={`(${product.numReviews})`} />
        </div>

        {/* Price & Action button */}
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-800/40">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 font-medium">Price</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 shadow-md ${
              added 
                ? 'bg-emerald-500 text-white scale-[0.98]' 
                : product.stock <= 0 
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-95 hover:shadow-purple-500/15 active:scale-[0.98]'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};

export default ProductCard;
