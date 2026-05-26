import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  PlusCircle,
  Edit2,
  Trash2,
  Truck,
  Settings,
  Layers,
  X,
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'stats';
  
  // Metrics state
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Lists state
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  
  // Modal configurations
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  
  // Modal Form State variables
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState('Notebooks');
  const [formBrand, setFormBrand] = useState('StationeryHub');
  const [formStock, setFormStock] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');

  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const activeToken = token || localStorage.getItem('token') || localStorage.getItem('sh_token');
      const { ok, data } = await api.orders.getStats(activeToken);
      if (ok) setStats(data);
    } catch (error) {
      console.error('Failed to load stats metrics:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoadingList(true);
    try {
      const { ok, data } = await api.products.getProducts({ pageSize: 100 });
      if (ok) setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to load product inventory:', error);
    } finally {
      setLoadingList(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingList(true);
    try {
      const activeToken = token || localStorage.getItem('token') || localStorage.getItem('sh_token');
      const { ok, data } = await api.orders.getOrders(activeToken);
      if (ok) setOrders(data);
    } catch (error) {
      console.error('Failed to load transaction orders:', error);
    } finally {
      setLoadingList(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingList(true);
    try {
      const activeToken = token || localStorage.getItem('token') || localStorage.getItem('sh_token');
      const { ok, data } = await api.auth.getUsers(activeToken);
      if (ok) setUsers(data);
    } catch (error) {
      console.error('Failed to load registered users directory:', error);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'stats') fetchStats();
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'users') fetchUsers();
    setFeedbackMsg({ type: '', text: '' });
  }, [activeTab]);

  const handleTabClick = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  const resetForm = () => {
    setFormName('');
    setFormPrice('');
    setFormCategory('Notebooks');
    setFormBrand('StationeryHub');
    setFormStock('');
    setFormDescription('');
    setFormImage('');
    setIsEditing(false);
    setSelectedProductId(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setFormName(prod.name);
    setFormPrice(prod.price);
    setFormCategory(prod.category);
    setFormBrand(prod.brand || 'StationeryHub');
    setFormStock(prod.stock);
    setFormDescription(prod.description);
    setFormImage(prod.images && prod.images[0] ? prod.images[0] : '');
    setIsEditing(true);
    setSelectedProductId(prod._id);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formName || !formPrice || !formStock || !formDescription) {
      setFeedbackMsg({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    const payload = {
      name: formName,
      price: Number(formPrice),
      category: formCategory,
      brand: formBrand,
      stock: Number(formStock),
      description: formDescription,
      images: formImage ? [formImage] : ['https://images.unsplash.com/photo-1586075010923-2dd45e9b2d4f?q=80&w=600'],
    };

    const activeToken = token || localStorage.getItem('token') || localStorage.getItem('sh_token');
    try {
      let ok, data;
      if (isEditing) {
        const res = await api.products.updateProduct(activeToken, selectedProductId, payload);
        ok = res.ok;
        data = res.data;
      } else {
        const res = await api.products.createProduct(activeToken, payload);
        ok = res.ok;
        data = res.data;
      }
      
      if (ok) {
        setFeedbackMsg({ type: 'success', text: isEditing ? 'Product modified successfully!' : 'New product created successfully!' });
        setModalOpen(false);
        resetForm();
        fetchProducts();
      } else {
        setFeedbackMsg({ type: 'error', text: data.message || 'Action execution failed.' });
      }
    } catch (error) {
      setFeedbackMsg({ type: 'error', text: 'Server connection error' });
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you absolutely sure you want to delete this stationery product?')) {
      const activeToken = token || localStorage.getItem('token') || localStorage.getItem('sh_token');
      try {
        const { ok, data } = await api.products.deleteProduct(activeToken, id);
        if (ok) {
          setFeedbackMsg({ type: 'success', text: 'Product removed from catalog.' });
          fetchProducts();
        } else {
          setFeedbackMsg({ type: 'error', text: data.message || 'Delete operation failed.' });
        }
      } catch (error) {
        setFeedbackMsg({ type: 'error', text: 'Server connection error' });
      }
    }
  };

  const handleToggleDelivery = async (id) => {
    const activeToken = token || localStorage.getItem('token') || localStorage.getItem('sh_token');
    try {
      const { ok, data } = await api.orders.deliverOrder(activeToken, id);
      if (ok) {
        setFeedbackMsg({ type: 'success', text: 'Order dispatch tracking level progressed!' });
        fetchOrders();
      } else {
        setFeedbackMsg({ type: 'error', text: data.message || 'Delivery toggling failed.' });
      }
    } catch (error) {
      setFeedbackMsg({ type: 'error', text: 'Server connection error' });
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you absolutely certain you want to purge this customer user profile?')) {
      const activeToken = token || localStorage.getItem('token') || localStorage.getItem('sh_token');
      try {
        const { ok, data } = await api.auth.deleteUser(activeToken, id);
        if (ok) {
          setFeedbackMsg({ type: 'success', text: 'Customer user profile safely purged.' });
          fetchUsers();
        } else {
          setFeedbackMsg({ type: 'error', text: data.message || 'Purging failed.' });
        }
      } catch (error) {
        setFeedbackMsg({ type: 'error', text: 'Server connection error' });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left dark:grad-bg min-h-screen">
      
      {/* Title */}
      <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
        <Settings className="w-7 h-7 text-purple-500" />
        <span>Admin Control Center</span>
      </h1>
      <p className="text-xs text-slate-400 mb-8 font-semibold">
        Monitor inventory status, view recent customer invoices, and adjust stationery catalogs.
      </p>

      {/* Tabs navigation panel */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-bold mb-8">
        <button
          onClick={() => handleTabClick('stats')}
          className={`pb-2 relative hover:text-purple-500 transition-colors ${
            activeTab === 'stats' ? 'text-purple-500 dark:text-purple-400 border-b-2 border-purple-500' : 'text-slate-400'
          }`}
        >
          Dashboard Metrics
        </button>
        <button
          onClick={() => handleTabClick('products')}
          className={`pb-2 relative hover:text-purple-500 transition-colors ${
            activeTab === 'products' ? 'text-purple-500 dark:text-purple-400 border-b-2 border-purple-500' : 'text-slate-400'
          }`}
        >
          Manage Products
        </button>
        <button
          onClick={() => handleTabClick('orders')}
          className={`pb-2 relative hover:text-purple-500 transition-colors ${
            activeTab === 'orders' ? 'text-purple-500 dark:text-purple-400 border-b-2 border-purple-500' : 'text-slate-400'
          }`}
        >
          Manage Orders
        </button>
        <button
          onClick={() => handleTabClick('users')}
          className={`pb-2 relative hover:text-purple-500 transition-colors ${
            activeTab === 'users' ? 'text-purple-500 dark:text-purple-400 border-b-2 border-purple-500' : 'text-slate-400'
          }`}
        >
          Manage Users
        </button>
      </div>

      {feedbackMsg.text && (
        <div className={`p-4 mb-6 rounded-2xl text-xs font-bold border max-w-3xl ${
          feedbackMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
        }`}>
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* TAB 1: METRICS HIGHLIGHT */}
      {activeTab === 'stats' && (
        <div className="flex flex-col gap-8">
          {statsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-28 rounded-2xl skeleton-loader" />)}
            </div>
          ) : !stats ? (
            <div className="text-center py-6 glass rounded-2xl text-slate-400">Failed to aggregate dashboard metrics.</div>
          ) : (
            <>
              {/* Tile grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Sales Tile */}
                <div className="p-6 rounded-2xl glass bg-white/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/40 hover:scale-[1.01] transition-transform duration-300 flex items-center justify-between">
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Gross Sales</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">${stats.totalSales.toFixed(2)}</span>
                  </div>
                  <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-500/20">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>

                {/* Orders count Tile */}
                <div className="p-6 rounded-2xl glass bg-white/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/40 hover:scale-[1.01] transition-transform duration-300 flex items-center justify-between">
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Gross Orders</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalOrders}</span>
                  </div>
                  <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl border border-purple-500/20">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                </div>

                {/* Users Count Tile */}
                <div className="p-6 rounded-2xl glass bg-white/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/40 hover:scale-[1.01] transition-transform duration-300 flex items-center justify-between">
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Customers</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalRegisteredUsers}</span>
                  </div>
                  <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-500/20">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                {/* Products Count Tile */}
                <div className="p-6 rounded-2xl glass bg-white/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/40 hover:scale-[1.01] transition-transform duration-300 flex items-center justify-between">
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Products Catalog</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalProducts}</span>
                  </div>
                  <div className="p-3 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-2xl border border-teal-500/20">
                    <Layers className="w-6 h-6" />
                  </div>
                </div>

              </div>

              {/* Aggregation listings */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Recent transaction rows */}
                <div className="lg:col-span-2 p-6 rounded-2xl glass bg-white/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/40">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4 block">Recent Purchases</span>
                  
                  {stats.recentOrders && stats.recentOrders.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No checkout records exist yet.</span>
                  ) : (
                    <div className="flex flex-col gap-3 text-xs">
                      {stats.recentOrders.map((ro) => (
                        <div key={ro._id} className="flex justify-between items-center p-3 rounded-xl bg-white/40 dark:bg-slate-955/20 border border-slate-100 dark:border-slate-850">
                          <div className="flex flex-col text-left">
                            <span className="font-bold text-slate-700 dark:text-slate-350">{ro.user?.name || 'Customer'}</span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-0.5 mt-0.5">
                              <Calendar className="w-3 h-3 text-purple-500" />
                              <span>{new Date(ro.createdAt).toLocaleDateString()}</span>
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="font-black text-slate-855 dark:text-white">${ro.totalPrice.toFixed(2)}</span>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                              ro.isPaid ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                            }`}>
                              {ro.isPaid ? 'Paid' : 'Unpaid'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Categories share split count */}
                <div className="p-6 rounded-2xl glass bg-white/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/40 text-left">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4 block">Catalog Distribution</span>
                  <div className="flex flex-col gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                    {stats.categoriesCount && stats.categoriesCount.map((cc) => (
                      <div key={cc._id} className="flex justify-between items-center py-1.5 border-b border-slate-105 dark:border-slate-855">
                        <span className="font-bold text-slate-700 dark:text-slate-350">{cc._id}</span>
                        <span className="font-mono text-slate-850 dark:text-white bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded-md font-bold">{cc.count} items</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCTS INVENTORY */}
      {activeTab === 'products' && (
        <div className="p-6 rounded-2xl glass bg-white/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/40">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Catalog Inventory</span>
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold hover:opacity-95 shadow-md flex items-center gap-1.5 glow-btn"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Stationery Product</span>
            </button>
          </div>

          {loadingList ? (
            <div className="flex flex-col gap-3 py-6">
              {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl skeleton-loader" />)}
            </div>
          ) : products.length === 0 ? (
            <span className="text-xs text-slate-400 italic">No products found in catalog. Create one!</span>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-850 text-slate-450 uppercase tracking-widest text-[9px] font-black">
                    <th className="pb-3 px-3">Product details</th>
                    <th className="pb-3 px-3">Category</th>
                    <th className="pb-3 px-3">Brand</th>
                    <th className="pb-3 px-3">Price</th>
                    <th className="pb-3 px-3">Stock Available</th>
                    <th className="pb-3 px-3 text-center">Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod._id} className="border-b border-slate-100 dark:border-slate-850/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                      <td className="py-3 px-3 font-medium flex items-center gap-3">
                        <img
                          src={prod.images && prod.images[0] ? prod.images[0] : 'https://images.unsplash.com/photo-1586075010923-2dd45e9b2d4f?q=80&w=600'}
                          alt={prod.name}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-800"
                        />
                        <span className="font-bold text-slate-800 dark:text-slate-250 truncate max-w-[200px]">{prod.name}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-450">{prod.category}</td>
                      <td className="py-3 px-3 text-slate-450">{prod.brand || 'StationeryHub'}</td>
                      <td className="py-3 px-3 font-extrabold text-slate-855 dark:text-white">${prod.price.toFixed(2)}</td>
                      <td className={`py-3 px-3 font-bold ${prod.stock <= 5 ? 'text-rose-500' : 'text-slate-655 dark:text-slate-300'}`}>
                        {prod.stock} left
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(prod)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-500 transition-colors"
                            aria-label="Edit details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod._id)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-rose-500 transition-colors"
                            aria-label="Purge item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="p-6 rounded-2xl glass bg-white/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/40">
          <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-6 block">Transactions and dispatch Tracking</span>

          {loadingList ? (
            <div className="flex flex-col gap-3 py-6">
              {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl skeleton-loader" />)}
            </div>
          ) : orders.length === 0 ? (
            <span className="text-xs text-slate-400 italic">No order invoices found in database.</span>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-850 text-slate-450 uppercase tracking-widest text-[9px] font-black">
                    <th className="pb-3 px-3">Receipt ID</th>
                    <th className="pb-3 px-3">Customer</th>
                    <th className="pb-3 px-3">Date</th>
                    <th className="pb-3 px-3">Gross Total</th>
                    <th className="pb-3 px-3">Payment</th>
                    <th className="pb-3 px-3">Shipping Status</th>
                    <th className="pb-3 px-3 text-center">Progress Dispatch</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-slate-100 dark:border-slate-855/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold tracking-tight text-purple-500">
                        #{order._id.substring(18).toUpperCase()}
                      </td>
                      <td className="py-3.5 px-3 text-slate-800 dark:text-slate-350 font-bold">{order.user?.name || 'Purged user'}</td>
                      <td className="py-3.5 px-3 text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-3.5 px-3 font-black text-slate-900 dark:text-white">${order.totalPrice.toFixed(2)}</td>
                      <td className="py-3.5 px-3">
                        {order.isPaid ? (
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">Paid</span>
                        ) : (
                          <span className="text-[9px] bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-bold">Unpaid</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                          order.status === 'Delivered' 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : order.status === 'Shipped'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        }`}>
                          <Truck className="w-3 h-3 flex-shrink-0" />
                          <span>{order.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <button
                          disabled={order.status === 'Delivered'}
                          onClick={() => handleToggleDelivery(order._id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-purple-500/20 text-[10px] font-bold text-purple-500 hover:bg-purple-500 hover:text-white transition-all mx-auto disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-purple-500"
                        >
                          <Truck className="w-3 h-3" />
                          <span>{order.status === 'Pending' || order.status === 'Processing' ? 'Ship order' : order.status === 'Shipped' ? 'Deliver' : 'Completed'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-2xl glass bg-white/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/40">
          <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-6 block">Registered customer Accounts</span>

          {loadingList ? (
            <div className="flex flex-col gap-3 py-6">
              {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl skeleton-loader" />)}
            </div>
          ) : users.length === 0 ? (
            <span className="text-xs text-slate-400 italic">No users found.</span>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-850 text-slate-450 uppercase tracking-widest text-[9px] font-black">
                    <th className="pb-3 px-3">Account Name</th>
                    <th className="pb-3 px-3">Email Address</th>
                    <th className="pb-3 px-3">Role clearance</th>
                    <th className="pb-3 px-3 text-center">Purge Account</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-slate-100 dark:border-slate-850/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-slate-800 dark:text-slate-350">{u.name}</td>
                      <td className="py-3.5 px-3 text-slate-450">{u.email}</td>
                      <td className="py-3.5 px-3 font-medium">
                        {u.isAdmin ? (
                          <span className="text-[9px] bg-purple-500/10 text-purple-500 font-extrabold border border-purple-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Admin Staff</span>
                        ) : (
                          <span className="text-[9px] bg-blue-500/10 text-blue-500 font-extrabold border border-blue-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Customer</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <button
                          disabled={u.isAdmin}
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-rose-500 transition-colors disabled:opacity-30 disabled:hover:text-slate-500 disabled:cursor-not-allowed inline-block"
                          aria-label="Purge Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* POP-UP MODAL: ADD / EDIT PRODUCT */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <div onClick={() => setModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" />

          {/* Modal Content */}
          <div className="relative w-full max-w-lg rounded-3xl glass bg-white dark:bg-slate-950 p-6 border border-slate-200 dark:border-slate-855 shadow-2xl animate-fade-in-up overflow-y-auto max-h-[90vh]">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4 block flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>{isEditing ? 'Modify Stationery specifications' : 'Create New Stationery'}</span>
            </span>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 text-xs">
              
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="Classic spiral notebook grid pattern..."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-white/50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="9.99"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-855 bg-white/50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Stock quantity</label>
                  <input
                    type="number"
                    required
                    placeholder="100"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-855 bg-white/50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-855 bg-white/50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Notebooks">Notebooks</option>
                    <option value="Pens">Pens</option>
                    <option value="Pencils">Pencils</option>
                    <option value="Markers">Markers</option>
                    <option value="Sticky Notes">Sticky Notes</option>
                    <option value="Files">Files</option>
                    <option value="School Bags">School Bags</option>
                    <option value="Art Supplies">Art Supplies</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Brand Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Pilot"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-855 bg-white/50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Product Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo..."
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-855 bg-white/50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Detailed Specifications</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe dimensions, texture, counts, acid-free status..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-855 bg-white/50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-between gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-3 border border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl text-slate-655 dark:text-slate-350"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-grow py-3 rounded-xl text-xs font-black text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-95 shadow-md"
                >
                  <span>{isEditing ? 'Save edits' : 'Publish Product'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
