import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, Search, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL State values
  const urlCategory = searchParams.get('category') || 'All';
  const urlSearch = searchParams.get('search') || '';

  // Local component states
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([
    'All', 'Notebooks', 'Pens', 'Pencils', 'Markers', 'Sticky Notes', 'Files', 'School Bags', 'Art Supplies'
  ]);
  
  // Advanced Filter state variables
  const [category, setCategory] = useState(urlCategory);
  const [search, setSearch] = useState(urlSearch);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  
  // Pagination variables
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    setCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const filters = {
        page,
        pageSize: 6,
        category,
        keyword: search,
        minPrice,
        maxPrice
      };
      
      const { ok, data } = await api.products.getProducts(filters);

      if (ok) {
        let items = data.products || [];
        
        // Handle sorting in client side (simpler and faster for small samples)
        if (sort === 'price-low') {
          items.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-high') {
          items.sort((a, b) => b.price - a.price);
        } else if (sort === 'rating') {
          items.sort((a, b) => b.ratings - a.ratings);
        }

        setProducts(items);
        setPages(data.pages || 1);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error('Failed to load products list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, category, search, minPrice, maxPrice, sort]);

  const handlePageClick = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setCategory('All');
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setPage(1);
    setSearchParams({});
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchParams(search ? { search } : {});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left dark:grad-bg min-h-screen">
      
      {/* Search Header and stats summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Workspace catalog</h1>
          <p className="text-xs text-slate-400 mt-1">
            Displaying <span className="text-purple-500 font-bold">{total}</span> unique items. {search && `Matching details for "${search}"`}
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Sorting */}
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="newest">Sort: Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Ratings: Highest Rated</option>
          </select>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar Filter Panel - Desktop */}
        <aside className="hidden md:flex flex-col gap-6 p-6 rounded-2xl glass bg-white/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/40 h-fit">
          
          <div className="flex justify-between items-center pb-3 border-b border-slate-200/50 dark:border-slate-800/40">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">Refine items</span>
            <button
              onClick={handleResetFilters}
              className="text-[10px] font-bold text-rose-500 hover:underline flex items-center gap-0.5"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search filter input */}
          <form onSubmit={handleSearchSubmit} className="flex items-center relative">
            <input
              type="text"
              placeholder="Search keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
          </form>

          {/* Category List checks */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Categories</span>
            <div className="flex flex-col gap-1.5 text-xs text-slate-650 dark:text-slate-350">
              {categories.map((cat, index) => (
                <label key={index} className="flex items-center gap-2 cursor-pointer py-0.5 group">
                  <input
                    type="radio"
                    name="category-choice"
                    checked={category === cat}
                    onChange={() => { setCategory(cat); setPage(1); }}
                    className="w-3.5 h-3.5 accent-purple-500"
                  />
                  <span className={`group-hover:text-purple-500 transition-colors ${category === cat ? 'text-purple-500 font-bold' : ''}`}>
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range input */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price bounds</span>
            <div className="flex items-center gap-2 text-xs">
              <input
                type="number"
                placeholder="Min ($)"
                value={minPrice}
                onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                placeholder="Max ($)"
                value={maxPrice}
                onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>
          </div>

        </aside>

        {/* Product listing Grid */}
        <main className="md:col-span-3 flex flex-col gap-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((id) => (
                <div key={id} className="h-[400px] rounded-2xl border border-slate-200 dark:border-slate-855 skeleton-loader" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 glass rounded-3xl border border-slate-200/50 dark:border-slate-855 flex flex-col items-center gap-3">
              <span className="text-slate-400 text-sm font-semibold">No items match your filter selection.</span>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-purple-500 text-white text-xs font-bold hover:bg-purple-600"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {/* Actual Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination controls */}
              {pages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4 pt-6 border-t border-slate-200/50 dark:border-slate-850">
                  <button
                    disabled={page === 1}
                    onClick={() => handlePageClick(page - 1)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-850"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {[...Array(pages).keys()].map((p) => (
                    <button
                      key={p + 1}
                      onClick={() => handlePageClick(p + 1)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold border transition-all ${
                        page === p + 1
                          ? 'bg-gradient-to-tr from-blue-500 to-purple-600 text-white border-transparent'
                          : 'border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350 hover:bg-slate-105 hover:bg-slate-100 dark:hover:bg-slate-850'
                      }`}
                    >
                      {p + 1}
                    </button>
                  ))}

                  <button
                    disabled={page === pages}
                    onClick={() => handlePageClick(page + 1)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-850"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>

      </div>

      {/* Sidebar Drawer Panel - Mobile */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Slider content */}
          <div className="relative w-80 max-w-xs h-full bg-white dark:bg-slate-950 p-6 flex flex-col gap-6 shadow-2xl animate-fade-in-up border-l border-slate-200 dark:border-slate-855 overflow-y-auto">
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-855">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">Refine items</span>
              <button
                onClick={() => { handleResetFilters(); setMobileFilterOpen(false); }}
                className="text-[10px] font-bold text-rose-500 flex items-center gap-0.5"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <form
              onSubmit={(e) => { handleSearchSubmit(e); setMobileFilterOpen(false); }}
              className="flex items-center relative"
            >
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
            </form>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Categories</span>
              <div className="flex flex-col gap-2 text-xs">
                {categories.map((cat, index) => (
                  <label key={index} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="mobile-cat"
                      checked={category === cat}
                      onChange={() => { setCategory(cat); setPage(1); setMobileFilterOpen(false); }}
                      className="w-3.5 h-3.5 accent-purple-500"
                    />
                    <span className={category === cat ? 'text-purple-500 font-bold' : 'text-slate-655 dark:text-slate-350'}>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price bounds</span>
              <div className="flex items-center gap-2 text-xs">
                <input
                  type="number"
                  placeholder="Min ($)"
                  value={minPrice}
                  onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Max ($)"
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="mt-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold shadow-lg"
            >
              Apply Refinements
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Products;
