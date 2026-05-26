import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { api } from '../services/api';
import Rating from '../components/Rating';
import ProductCard from '../components/ProductCard';
import { Heart, ShoppingCart, ShieldCheck, ChevronLeft, Calendar, User, MessageSquare, AlertCircle, Plus, Minus } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const { user, token, toggleWishlist, isInWishlist } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Review submission state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState({ type: '', text: '' });

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const { ok, data } = await api.products.getProductById(id);
      if (ok) {
        setProduct(data);
        setActiveImage(data.images && data.images[0] ? data.images[0] : '');
        fetchRelatedProducts(data.category, data._id);
      }
    } catch (error) {
      console.error('Failed to load product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category, currentId) => {
    try {
      const { ok, data } = await api.products.getProducts({ category, pageSize: 4 });
      if (ok) {
        const filtered = (data.products || []).filter(p => p._id !== currentId);
        setRelatedProducts(filtered);
      }
    } catch (error) {
      console.error('Failed to load related products:', error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    setQty(1);
    setReviewMessage({ type: '', text: '' });
    setComment('');
  }, [id]);

  const handleQtyChange = (val) => {
    const newVal = qty + val;
    if (newVal >= 1 && newVal <= product.stock) {
      setQty(newVal);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, qty);
      setReviewMessage({ type: 'success', text: `Added ${qty} item(s) to your cart successfully!` });
      setTimeout(() => setReviewMessage({ type: '', text: '' }), 4000);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setReviewMessage({ type: 'error', text: 'Please write a review comment.' });
      return;
    }

    setReviewLoading(true);
    setReviewMessage({ type: '', text: '' });
    try {
      const activeToken = token || localStorage.getItem('token') || localStorage.getItem('sh_token');
      const { ok, data } = await api.products.createReview(activeToken, id, { rating, comment });

      if (ok) {
        setReviewMessage({ type: 'success', text: 'Review submitted successfully!' });
        setComment('');
        fetchProductDetails(); // Refresh ratings/reviews
      } else {
        setReviewMessage({ type: 'error', text: data.message || 'Failed to submit review' });
      }
    } catch (error) {
      setReviewMessage({ type: 'error', text: 'Server connection error' });
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left dark:grad-bg min-h-screen">
        <Link to="/products" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-purple-500 mb-6">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to catalog</span>
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="h-96 rounded-2xl skeleton-loader" />
          <div className="flex flex-col gap-4">
            <div className="h-8 w-1/3 rounded-lg skeleton-loader" />
            <div className="h-12 w-2/3 rounded-lg skeleton-loader" />
            <div className="h-6 w-1/4 rounded-lg skeleton-loader" />
            <div className="h-32 rounded-lg skeleton-loader" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center dark:grad-bg min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-12 h-12 text-slate-400" />
        <span className="text-sm font-semibold text-slate-400">Product not found in database.</span>
        <Link to="/products" className="px-6 py-2 bg-purple-500 text-white rounded-xl text-xs font-bold">
          Go back to catalog
        </Link>
      </div>
    );
  }

  const favorited = isInWishlist(product._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left dark:grad-bg min-h-screen">
      
      {/* Navigation breadcrumbs */}
      <Link to="/products" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-purple-500 mb-6 font-semibold">
        <ChevronLeft className="w-4 h-4" />
        <span>Back to catalog</span>
      </Link>

      {/* Main product specs block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
        
        {/* Left Column: Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative h-96 w-full rounded-2xl overflow-hidden glass border border-slate-200/50 dark:border-slate-800/40 shadow-md">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.stock <= 0 && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-black uppercase px-3 py-1 rounded-full">
                Sold Out
              </span>
            )}
          </div>

          {/* Thumbnails row */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden glass border transition-all ${
                    activeImage === img ? 'border-purple-500 scale-95 shadow-md shadow-purple-500/10' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <img src={img} alt={`thumbnail-${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Descriptions and buying tools */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">{product.brand}</span>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-snug">{product.name}</h1>
            
            <div className="flex items-center gap-4 mt-2">
              <Rating value={product.ratings} text={`(${product.numReviews} review counts)`} />
              
              {/* Stock check */}
              {product.stock <= 0 ? (
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">Sold Out</span>
              ) : product.stock <= 5 ? (
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">Limited Stock (Only {product.stock} left)</span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">In Stock</span>
              )}
            </div>
          </div>

          <div className="text-2xl font-black text-slate-900 dark:text-white py-1">
            ${product.price.toFixed(2)}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {product.description}
          </p>

          <hr className="border-slate-200/50 dark:border-slate-800/40 my-1" />

          {/* Action notification card */}
          {reviewMessage.type && (
            <div className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 border ${
              reviewMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
            }`}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{reviewMessage.text}</span>
            </div>
          )}

          {/* Buy Tools */}
          {product.stock > 0 && (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              
              {/* Qty incrementer */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 w-full sm:w-fit justify-between">
                <button
                  onClick={() => handleQtyChange(-1)}
                  disabled={qty === 1}
                  className="p-2 rounded-xl text-slate-500 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-850"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-slate-800 dark:text-white">{qty}</span>
                <button
                  onClick={() => handleQtyChange(1)}
                  disabled={qty >= product.stock}
                  className="p-2 rounded-xl text-slate-500 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-850"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-95 transition-all shadow-lg shadow-purple-500/10 active:scale-[0.98] glow-btn"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Shopping Cart</span>
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(product._id)}
                className={`p-3 rounded-2xl border transition-all ${
                  favorited 
                    ? 'bg-rose-500 border-transparent text-white' 
                    : 'border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-300 hover:bg-slate-105 hover:bg-slate-100 dark:hover:bg-slate-850'
                }`}
                aria-label="Add to Wishlist"
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
              </button>

            </div>
          )}

          {/* Reassurance */}
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase mt-2">
            <ShieldCheck className="w-4 h-4 text-purple-500" />
            <span>Premium Quality Stationery Guaranteed</span>
          </div>

        </div>

      </div>

      {/* Tabs Layout */}
      <div className="border-t border-slate-200/50 dark:border-slate-800/40 pt-10 mb-16">
        
        {/* Tab Header Buttons */}
        <div className="flex border-b border-slate-200/50 dark:border-slate-800/40 gap-6 text-sm font-bold pb-2">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-2 relative hover:text-purple-500 transition-colors ${
              activeTab === 'description' ? 'text-purple-500 dark:text-purple-400 border-b-2 border-purple-500' : 'text-slate-400'
            }`}
          >
            Detailed Specifications
          </button>
          
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-2 relative hover:text-purple-500 transition-colors ${
              activeTab === 'reviews' ? 'text-purple-500 dark:text-purple-400 border-b-2 border-purple-500' : 'text-slate-400'
            }`}
          >
            Customer Reviews ({product.reviews ? product.reviews.length : 0})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="py-6 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {activeTab === 'description' ? (
            <div className="flex flex-col gap-4">
              <p>
                Our premium <strong>{product.name}</strong> from <strong>{product.brand}</strong> matches the highest quality criteria in the industry. It belongs to our elite <strong>{product.category}</strong> portfolio, designed specially to simplify complex workflows and bring pure visual satisfaction to your study, office, or design studio.
              </p>
              <div className="grid grid-cols-2 max-w-md gap-3 py-2 text-left border-y border-slate-105 dark:border-slate-855">
                <span className="font-bold text-slate-800 dark:text-slate-350">Brand</span>
                <span>{product.brand}</span>
                <span className="font-bold text-slate-800 dark:text-slate-350">Category</span>
                <span>{product.category}</span>
                <span className="font-bold text-slate-800 dark:text-slate-350">Stock Available</span>
                <span>{product.stock} items</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Left tab: list of reviews */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {(!product.reviews || product.reviews.length === 0) ? (
                  <span className="text-slate-400 italic">No reviews exist for this stationery product yet. Be the first to share your workspace experiences!</span>
                ) : (
                  <div className="flex flex-col gap-4">
                    {product.reviews.map((rev) => (
                      <div key={rev._id} className="p-4 rounded-2xl glass bg-white/40 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/40">
                        <div className="flex justify-between items-center gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-[10px]">
                              <User className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-bold text-slate-700 dark:text-slate-300">{rev.name}</span>
                          </div>
                          <Rating value={rev.rating} />
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-550 dark:text-slate-400 pl-10">
                          {rev.comment}
                        </p>
                        <span className="text-[9px] text-slate-400 flex items-center gap-1 pl-10 mt-2">
                          <Calendar className="w-3 h-3 text-purple-500" />
                          <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right tab: add review form */}
              <div className="flex flex-col gap-4 p-5 rounded-2xl glass bg-white/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/40 h-fit">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">Share your thoughts</span>
                
                {user ? (
                  <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Score rating</label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-805 dark:text-slate-200 focus:outline-none"
                      >
                        <option value="5">5 Stars — Excellent!</option>
                        <option value="4">4 Stars — Very Good</option>
                        <option value="3">3 Stars — Average</option>
                        <option value="2">2 Stars — Dissatisfied</option>
                        <option value="1">1 Star — Terrible</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] font-bold text-slate-450 uppercase">Your feedback comment</label>
                      <textarea
                        rows="3"
                        placeholder="Write your product experience here..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={reviewLoading}
                      className="px-4 py-2.5 rounded-xl bg-purple-500 text-white text-xs font-bold hover:bg-purple-600 disabled:opacity-50 flex justify-center items-center gap-1.5 shadow-md shadow-purple-500/10"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{reviewLoading ? 'Submitting...' : 'Submit feedback'}</span>
                    </button>
                  </form>
                ) : (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex flex-col items-center gap-2">
                    <span className="text-center font-medium">Please sign in to write reviews.</span>
                    <Link to="/login" className="px-4 py-1.5 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-colors">
                      Sign In
                    </Link>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-slate-200/50 dark:border-slate-800/40 pt-12">
          <div className="text-left mb-8">
            <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">Workspace Harmony</span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Related stationery items</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetails;
