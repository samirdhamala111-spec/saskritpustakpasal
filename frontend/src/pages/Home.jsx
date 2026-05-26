import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import {
  Sparkles,
  Search,
  BookOpen,
  PenTool,
  Bookmark,
  Backpack,
  Compass,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star
} from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { ok, data } = await api.products.getProducts({ pageSize: 4 });
        if (ok) {
          setFeaturedProducts(data.products || []);
        }
      } catch (error) {
        console.error('Failed to load featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  const categories = [
    { name: 'Notebooks', icon: BookOpen, count: 'Classic Journals & Spiral Planners', color: 'from-blue-500 to-indigo-500' },
    { name: 'Pens', icon: PenTool, count: 'Luxury Fountains & Gel Tip Sets', color: 'from-purple-500 to-pink-500' },
    { name: 'Markers', icon: Sparkles, count: 'Art Lettering & Pastel Highlighters', color: 'from-teal-500 to-emerald-500' },
    { name: 'Sticky Notes', icon: Bookmark, count: 'Morandi sticky notes & index tabs', color: 'from-rose-500 to-pink-500' },
    { name: 'School Bags', icon: Backpack, count: 'Ergonomic school & computer packs', color: 'from-violet-500 to-purple-500' },
    { name: 'Art Supplies', icon: Compass, count: 'watercolorhalf-pans & brush kits', color: 'from-fuchsia-500 to-rose-500' },
  ];

  return (
    <div className="relative overflow-hidden w-full pb-16 dark:grad-bg">
      
      {/* Background blobs for premium glowing blur effects */}
      <div className="absolute top-10 left-1/4 w-[350px] h-[350px] rounded-full glow-purple pointer-events-none opacity-40 dark:opacity-50" />
      <div className="absolute top-80 right-1/4 w-[300px] h-[300px] rounded-full glow-blue pointer-events-none opacity-30 dark:opacity-40" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Hero text */}
          <div className="flex flex-col gap-6 text-left animate-fade-in-up">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold w-fit animate-pulse-subtle">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Elevate Your Workspace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white">
              Innovating <br />
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Creativity & Focus
              </span> <br />
              At Your Desk
            </h1>

            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
              Explore our curated collections of aesthetic notebooks, double-ended calligraphy brush markers, executive writing instruments, files, and high-fidelity art supplies. Crafted to inspire minds.
            </p>

            {/* In-hero Search form */}
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md mt-2">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="What is your workspace missing?..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-purple-500/20 hover:opacity-95 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] glow-btn"
              >
                Search
              </button>
            </form>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/50 dark:border-slate-800/40">
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-slate-800 dark:text-white">10K+</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Creators Served</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-slate-800 dark:text-white">500+</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Premium Items</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-slate-800 dark:text-white">4.9★</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Customer Rating</span>
              </div>
            </div>

          </div>

          {/* Hero graphic */}
          <div className="relative flex justify-center items-center h-full animate-float">
            
            {/* Visual Glass plate backdrops */}
            <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 opacity-20 blur-xl" />
            
            <div className="relative glass bg-white/40 dark:bg-slate-900/30 rounded-3xl p-6 border border-white/20 dark:border-slate-800/60 shadow-2xl max-w-sm w-full">
              
              {/* Product mock card floating inside hero */}
              <div className="rounded-2xl overflow-hidden shadow-lg bg-slate-950 text-white relative">
                <img
                  src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600"
                  alt="Aesthetic workspace"
                  className="w-full h-56 object-cover opacity-85"
                />
                
                <div className="p-4 flex flex-col gap-1 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent">
                  <span className="text-[9px] text-purple-400 font-bold uppercase tracking-widest">StationeryHub Selects</span>
                  <h3 className="text-sm font-bold">Premium Artist watercolor Pans</h3>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-850">
                    <span className="text-xs font-bold text-slate-350">$34.50</span>
                    <Link to="/products" className="text-[10px] text-purple-400 font-bold flex items-center gap-0.5 hover:underline">
                      <span>Shop Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Trust factors */}
      <section className="bg-slate-100/50 dark:bg-slate-950/40 border-y border-slate-200/50 dark:border-slate-850 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="flex gap-3.5 items-start">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Fast Worldwide delivery</h4>
              <p className="text-[11px] text-slate-400 mt-1">Free standard delivery on all premium orders exceeding $50.</p>
            </div>
          </div>

          <div className="flex gap-3.5 items-start">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">100% Secure Checkout</h4>
              <p className="text-[11px] text-slate-400 mt-1">Your privacy is crucial. Transactions are gated with heavy encryption safeguards.</p>
            </div>
          </div>

          <div className="flex gap-3.5 items-start">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Hassle-Free Returns</h4>
              <p className="text-[11px] text-slate-400 mt-1">Faulty stationery items are covered by our friendly 30-day refund window.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
          <div className="text-left">
            <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">Browse Curated Stationery</span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Shop by Category</h2>
          </div>
          <Link to="/products" className="text-xs font-bold text-purple-500 hover:text-purple-600 flex items-center gap-1">
            <span>Explore all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/products?category=${cat.name}`}
              className="group relative rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/40 glass bg-white/70 dark:bg-slate-900/30 overflow-hidden hover:scale-[1.01] hover:shadow-lg transition-all duration-300"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-tr ${cat.color} opacity-5 group-hover:opacity-10 rounded-bl-full transition-opacity duration-300`} />
              
              <div className="flex items-center gap-4">
                <div className={`p-3.5 rounded-xl bg-gradient-to-tr ${cat.color} text-white group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  <cat.icon className="w-5 h-5" />
                </div>
                
                <div className="text-left">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">{cat.count}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Promotional banner card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
          
          <div className="text-left flex flex-col gap-1.5 z-10">
            <span className="text-[9px] font-extrabold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-md w-fit">Seasonal Deal</span>
            <h3 className="text-xl sm:text-2xl font-black">Unlock 15% off Writing & Calligraphy Markers</h3>
            <p className="text-xs text-white/80">Use the promotional code <span className="font-bold text-yellow-300">WRI2026</span> at checkout page.</p>
          </div>

          <Link
            to="/products?category=Markers"
            className="px-6 py-3 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-black transition-all duration-300 hover:scale-[1.02] shadow-lg flex-shrink-0 z-10"
          >
            Claim discount code
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-left mb-8">
          <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">Handpicked Workpieces</span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Featured stationery</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((id) => (
              <div key={id} className="h-[400px] rounded-2xl border border-slate-200 dark:border-slate-800 skeleton-loader" />
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-12 glass rounded-2xl">
            <span className="text-xs font-medium text-slate-400">No stationery products found. Run seed command!</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800/40 relative">
          <h3 className="text-xs font-bold text-purple-500 uppercase tracking-widest text-center block mb-1">Loved by Designers & Students</h3>
          <h4 className="text-xl font-black text-slate-900 dark:text-white text-center mt-1 mb-8">Creator Stories</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white/40 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850">
              <div className="flex items-center gap-1 text-amber-400">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <p className="text-xs italic text-slate-500 dark:text-slate-400">
                "Finding high quality, smooth acid-free notebooks is extremely tough, but the leather bound journals here are flawless. The grid patterns are solid and there is no ink bleeding whatsoever!"
              </p>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-350">— Clarissa V., Architect</span>
            </div>

            <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white/40 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850">
              <div className="flex items-center gap-1 text-amber-400">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <p className="text-xs italic text-slate-500 dark:text-slate-400">
                "The pilot black gel pens are amazing for sketching layouts, and delivery to Nepal was incredibly fast. Support was very responsive when tracking my delivery invoice!"
              </p>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-350">— Benjamin K., Product Designer</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
