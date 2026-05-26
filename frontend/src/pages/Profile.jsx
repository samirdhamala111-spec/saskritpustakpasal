import React, { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import {
  User, ShoppingBag, Heart, Lock, Camera, Package,
  CheckCircle, Clock, Truck, AlertCircle, Edit3, Save, X
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  const map = {
    Delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Shipped:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Processing:'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    Pending:   'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  };
  const icons = { Delivered: CheckCircle, Shipped: Truck, Processing: Package, Pending: Clock };
  const Icon = icons[status] || Clock;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${map[status] || map.Pending}`}>
      <Icon className="w-3 h-3" /> {status || 'Processing'}
    </span>
  );
};

const Profile = () => {
  const { user, token, updateProfile, toggleWishlist } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [saveMsg, setSaveMsg] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    if (user) { setName(user.name); setEmail(user.email); setProfilePic(user.profilePic || ''); }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders' || activeTab === 'overview') fetchOrders();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'wishlist') fetchWishlist();
  }, [activeTab, user?.wishlist]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    const activeToken = token || localStorage.getItem('token') || localStorage.getItem('sh_token');
    const { ok, data } = await api.orders.getMyOrders(activeToken);
    if (ok) setOrders(Array.isArray(data) ? data : []);
    setOrdersLoading(false);
  };

  const fetchWishlist = async () => {
    if (!user?.wishlist?.length) { setWishlistItems([]); return; }
    setWishlistLoading(true);
    const resolved = [];
    for (const id of user.wishlist) {
      const { ok, data } = await api.products.getProductById(id);
      if (ok) resolved.push(data);
    }
    setWishlistItems(resolved);
    setWishlistLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setSaveMsg({ type: '', text: '' });
    const payload = { name, email, profilePic };
    if (password.trim()) {
      if (password.length < 6) { setSaveMsg({ type: 'error', text: 'Password must be at least 6 characters.' }); setSaving(false); return; }
      payload.password = password;
    }
    const result = await updateProfile(payload);
    setSaving(false);
    if (result.success) { setSaveMsg({ type: 'success', text: 'Profile updated successfully!' }); setEditing(false); setPassword(''); }
    else setSaveMsg({ type: 'error', text: result.message || 'Update failed.' });
  };

  const totalSpent = orders.filter(o => o.isPaid).reduce((s, o) => s + Number(o.totalPrice), 0);
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Edit3 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 h-40" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-16">
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              {user?.profilePic ? (
                <img src={user.profilePic} alt={user.name} className="w-20 h-20 rounded-2xl object-cover border-4 border-white dark:border-slate-800 shadow-lg" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black border-4 border-white dark:border-slate-800 shadow-lg">
                  {initials}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">{user?.name}</h1>
                {user?.isAdmin && (
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full border border-purple-200 dark:border-purple-700">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{user?.email}</p>
            </div>
            {/* Quick stats */}
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{orders.length}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Orders</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">${totalSpent.toFixed(0)}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Spent</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{user?.wishlist?.length || 0}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Wishlist</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 border-b border-slate-200 dark:border-slate-800">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setSearchParams({ tab: t.id })}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                  activeTab === t.id
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent orders */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Orders</h2>
              {ordersLoading ? (
                <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 rounded-xl skeleton-loader" />)}</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-10">
                  <ShoppingBag className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400 text-sm">No orders yet</p>
                  <Link to="/products" className="mt-3 inline-block px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700">Shop Now</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 5).map(order => (
                    <div key={order._id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">Order #{order._id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={order.status} />
                        <span className="font-bold text-slate-900 dark:text-white">${Number(order.totalPrice).toFixed(2)}</span>
                        <Link to={`/order-success/${order._id}`} className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-medium">View</Link>
                      </div>
                    </div>
                  ))}
                  {orders.length > 5 && (
                    <button onClick={() => setSearchParams({ tab: 'orders' })} className="w-full py-2 text-sm text-purple-600 dark:text-purple-400 font-semibold hover:underline">
                      View all {orders.length} orders →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Account info */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Account Info</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Account Type</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.isAdmin ? 'Administrator' : 'Customer'}</p>
                </div>
                <button
                  onClick={() => setSearchParams({ tab: 'settings' })}
                  className="w-full mt-2 py-2.5 rounded-xl border-2 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 text-sm font-bold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition"
                >
                  Edit Profile
                </button>
                {user?.isAdmin && (
                  <Link to="/admin" className="block w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold text-center hover:opacity-90 transition">
                    Go to Admin Panel
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Order History</h2>
            {ordersLoading ? (
              <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-20 rounded-xl skeleton-loader" />)}</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-14 h-14 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No orders yet</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Start shopping to see your orders here</p>
                <Link to="/products" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:opacity-90">Browse Products</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order._id} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                    {/* Order header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">ORDER ID</p>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">#{order._id.slice(0, 8).toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">DATE</p>
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">{new Date(order.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">TOTAL</p>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">${Number(order.totalPrice).toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={order.status} />
                        {order.isPaid ? (
                          <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">Paid</span>
                        ) : (
                          <span className="px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-semibold rounded-full">Unpaid</span>
                        )}
                        <Link to={`/order-success/${order._id}`} className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                          View Invoice
                        </Link>
                      </div>
                    </div>
                    {/* Order items */}
                    <div className="p-4">
                      <div className="flex flex-wrap gap-3">
                        {order.orderItems?.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2">
                            {item.image && <img src={item.image} alt={item.name} className="w-8 h-8 rounded-md object-cover" />}
                            <div>
                              <p className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1 max-w-[140px]">{item.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Qty: {item.qty} × ${Number(item.price).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {order.shippingAddress && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
                          Shipping to: {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── WISHLIST TAB ── */}
        {activeTab === 'wishlist' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">My Wishlist ({user?.wishlist?.length || 0} items)</h2>
            {wishlistLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3].map(i => <div key={i} className="h-80 rounded-2xl skeleton-loader" />)}
              </div>
            ) : wishlistItems.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-14 h-14 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Your wishlist is empty</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Save products you love to buy them later</p>
                <Link to="/products" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:opacity-90">Explore Products</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            )}
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Edit Profile</h2>

              {saveMsg.text && (
                <div className={`mb-5 p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
                  saveMsg.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                }`}>
                  {saveMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {saveMsg.text}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-5">
                {/* Avatar preview */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  {profilePic ? (
                    <img src={profilePic} alt="Preview" className="w-14 h-14 rounded-xl object-cover border-2 border-purple-200 dark:border-purple-800" onError={e => e.target.style.display='none'} />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-black">{initials}</div>
                  )}
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Profile Picture URL</label>
                    <input
                      type="url" placeholder="https://..."
                      value={profilePic} onChange={e => setProfilePic(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                  <input
                    type="text" required value={name} onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                  <input
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    New Password <span className="text-slate-400 font-normal">(leave blank to keep current)</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <button
                  type="submit" disabled={saving}
                  className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>

            {/* Account summary card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 h-fit">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Account Summary</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Total Orders', value: orders.length, color: 'from-blue-500 to-indigo-500' },
                  { label: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, color: 'from-purple-500 to-pink-500' },
                  { label: 'Wishlist Items', value: user?.wishlist?.length || 0, color: 'from-rose-500 to-orange-500' },
                  { label: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length, color: 'from-green-500 to-teal-500' },
                ].map(s => (
                  <div key={s.label} className={`p-4 rounded-xl bg-gradient-to-br ${s.color} text-white`}>
                    <p className="text-2xl font-black">{s.value}</p>
                    <p className="text-xs font-semibold opacity-80 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
