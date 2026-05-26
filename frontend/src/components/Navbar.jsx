import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import {
  ShoppingBag,
  User,
  Heart,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, wishlist } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const navigate = useNavigate();

  // Handle Theme switching
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchKeyword.trim())}`);
      setSearchKeyword('');
    }
  };

  const totalCartQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="sticky top-0 z-50 transition-all duration-300 w-full glass bg-white/70 dark:bg-slate-900/75 border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform duration-300">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent group-hover:opacity-90">
                Stationery<span className="text-slate-850 dark:text-white font-black">Hub</span>
              </span>
            </Link>
          </div>

          {/* Center Links - Desktop */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-purple-500 transition-colors py-2 text-slate-600 dark:text-slate-300">Home</Link>
            <Link to="/products" className="hover:text-purple-500 transition-colors py-2 text-slate-600 dark:text-slate-300">Products</Link>
            <Link to="/about" className="hover:text-purple-500 transition-colors py-2 text-slate-600 dark:text-slate-300">About</Link>
            <Link to="/contact" className="hover:text-purple-500 transition-colors py-2 text-slate-600 dark:text-slate-300">Contact</Link>
          </div>

          {/* Search bar - Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative max-w-xs w-full mx-4">
            <input
              type="text"
              placeholder="Search premium stationery..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-1.5 rounded-full text-xs transition-all duration-300 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:focus:ring-purple-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          </form>

          {/* Action icons - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Wishlist Link */}
            <Link
              to="/profile?tab=wishlist"
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 relative transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full animate-ping" />
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 relative transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartQty > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-white dark:border-slate-900 shadow-md">
                  {totalCartQty}
                </span>
              )}
            </Link>

            {/* Admin Panel Actions */}
            {user && user.isAdmin && (
              <div className="relative">
                <button
                  onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                  onBlur={() => setTimeout(() => setAdminDropdownOpen(false), 200)}
                  className="flex items-center gap-1 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors text-xs font-semibold"
                >
                  <Settings className="w-4 h-4 text-purple-500" />
                  <span>Admin</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${adminDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {adminDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl border border-slate-100 dark:border-slate-850 glass bg-white dark:bg-slate-950 py-1 z-50 transition-all duration-350">
                    <Link to="/admin" className="block px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/20">
                      Dashboard Stats
                    </Link>
                    <Link to="/admin?tab=products" className="block px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/20">
                      Manage Products
                    </Link>
                    <Link to="/admin?tab=orders" className="block px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/20">
                      Manage Orders
                    </Link>
                    <Link to="/admin?tab=users" className="block px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/20">
                      Manage Users
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Profile Avatar / User Login Action */}
            {user ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800"
              >
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-purple-500 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold uppercase">
                    {user.name.substring(0, 2)}
                  </div>
                )}
                <span className="hidden lg:block text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-purple-500 transition-colors">
                  {user.name.split(' ')[0]}
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-full shadow-lg shadow-purple-500/25 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 glow-btn"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile hamburger - Menu trigger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <Link
              to="/cart"
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 relative"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCartQty > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center">
                  {totalCartQty}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-4 px-6 animate-fade-in-up">
          
          {/* Mobile search bar */}
          <form onSubmit={handleSearchSubmit} className="flex items-center relative mb-4">
            <input
              type="text"
              placeholder="Search stationery..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full text-xs border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
          </form>

          <div className="flex flex-col gap-3 font-medium text-sm">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-purple-500 transition-colors py-1 text-slate-600 dark:text-slate-300">Home</Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="hover:text-purple-500 transition-colors py-1 text-slate-600 dark:text-slate-300">Products</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-purple-500 transition-colors py-1 text-slate-600 dark:text-slate-300">About Us</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-purple-500 transition-colors py-1 text-slate-600 dark:text-slate-300">Contact</Link>
            
            {user && user.isAdmin && (
              <>
                <hr className="border-slate-100 dark:border-slate-850" />
                <span className="text-purple-500 font-bold text-xs">Admin Controls</span>
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="pl-2 hover:text-purple-500 transition-colors py-0.5 text-xs text-slate-500">Dashboard Stats</Link>
                <Link to="/admin?tab=products" onClick={() => setMobileMenuOpen(false)} className="pl-2 hover:text-purple-500 transition-colors py-0.5 text-xs text-slate-500">Manage Products</Link>
                <Link to="/admin?tab=orders" onClick={() => setMobileMenuOpen(false)} className="pl-2 hover:text-purple-500 transition-colors py-0.5 text-xs text-slate-500">Manage Orders</Link>
              </>
            )}

            <hr className="border-slate-100 dark:border-slate-850" />
            
            {user ? (
              <div className="flex flex-col gap-3">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  <User className="w-4 h-4 text-purple-500" />
                  <span>My Profile ({user.name.split(' ')[0]})</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-xs font-bold text-rose-500 hover:text-rose-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 py-2 rounded-full shadow-md"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
