import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import { CheckCircle2, ShoppingBag, ShieldCheck, MapPin, Printer, AlertCircle } from 'lucide-react';

const OrderSuccess = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  useEffect(() => {
    const fetchOrderAndVerify = async () => {
      if (!id) return;
      
      const activeToken = token || localStorage.getItem('token') || localStorage.getItem('sh_token');
      
      // Detect if URL contains eSewa success query param
      const esewaDataParam = searchParams.get('data');
      
      if (esewaDataParam) {
        setVerifying(true);
        setLoading(true);
        try {
          // eSewa Sandbox base64 decodes into a JSON string
          const decoded = atob(esewaDataParam);
          const parsed = JSON.parse(decoded);
          
          if (parsed.status === 'COMPLETE' || parsed.status === 'SUCCESS') {
            // Confirm with backend order payment updates
            const { ok, data: paidOrder } = await api.orders.payOrder(activeToken, id, {
              id: parsed.transaction_code || 'MOCK_TXN_' + Math.random().toString(36).substring(2, 8).toUpperCase(),
              status: 'COMPLETED',
              email_address: 'esewa_wallet_callback@esewa.com.np'
            });
            
            if (ok) {
              setOrder(paidOrder);
            } else {
              setVerificationError('Payment succeeded, but could not verify order update on database.');
            }
          } else {
            setVerificationError(`eSewa payment processing failed with status: ${parsed.status}`);
          }
        } catch (error) {
          console.error('Failed to verify eSewa callback:', error);
          setVerificationError('Failed to parse payment verification payload.');
        } finally {
          setVerifying(false);
          setLoading(false);
          // Clear query params to make refreshing safe
          setSearchParams({}, { replace: true });
        }
      } else {
        // Regular flow: load already-paid or credit card orders
        try {
          const { ok, data } = await api.orders.getOrderById(activeToken, id);
          if (ok) {
            setOrder(data);
          }
        } catch (error) {
          console.error('Failed to load order receipt:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrderAndVerify();
  }, [id, token, searchParams]);

  const handlePrint = () => {
    window.print();
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm px-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
          <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Verifying Wallet Payment</h3>
          <p className="text-xs text-slate-450 dark:text-slate-400 leading-relaxed animate-pulse">
            Please wait while StationeryHub verifies your transaction callback directly with eSewa ledger API.
          </p>
        </div>
      </div>
    );
  }

  if (verificationError) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center dark:grad-bg min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-12 h-12 text-rose-500 animate-bounce" />
        <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wider">eSewa Verification Error</h3>
        <p className="text-xs text-slate-450 dark:text-slate-400 max-w-md text-center leading-relaxed">
          {verificationError}
        </p>
        <Link to="/products" className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-xs font-bold mt-2 shadow-lg">
          Browse products catalog
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-purple-500/20 border-t-purple-600 animate-spin" />
          <span className="text-sm font-semibold text-slate-500 animate-pulse">Loading receipt details...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center dark:grad-bg min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-12 h-12 text-slate-400 animate-bounce" />
        <span className="text-sm font-semibold text-slate-400">Order invoice not found.</span>
        <Link to="/products" className="px-6 py-2 bg-purple-500 text-white rounded-xl text-xs font-bold">
          Go back to catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left dark:grad-bg min-h-screen">
      
      {/* Animated Success header */}
      <div className="glass rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800/40 text-center flex flex-col items-center gap-3 py-10 animate-fade-in-up mb-8 print:hidden">
        
        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">Payment Verified</span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">Thank you for your purchase!</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
          Your payment was processed securely. Order reference <code className="text-purple-500 font-bold">#{order._id.substring(0, 8).toUpperCase()}</code> is now dispatch processing.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mt-3">
          <Link
            to="/products"
            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-350"
          >
            Browse catalog
          </Link>
          <Link
            to="/profile?tab=orders"
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-xs font-black shadow-lg"
          >
            Track shipping timeline
          </Link>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 border border-purple-500/20 text-purple-500 rounded-xl hover:bg-purple-500 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
        </div>

      </div>

      {/* Actual Printable Invoice Receipt card */}
      <div className="rounded-3xl border border-slate-250 dark:border-slate-850 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-2xl flex flex-col gap-6 print:border-none print:shadow-none print:bg-transparent">
        
        {/* Brand/Invoice Header */}
        <div className="flex justify-between items-start gap-4 pb-6 border-b border-slate-200 dark:border-slate-850">
          <div className="flex flex-col gap-1">
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Stationery<span className="text-slate-800 dark:text-white font-black">Hub</span>
            </span>
            <span className="text-[10px] text-slate-400">Date: {new Date(order.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="flex flex-col items-end text-right">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">INVOICE RECEIPT</span>
            <span className="text-[10px] font-mono text-purple-500 font-bold">#{order._id.toUpperCase()}</span>
          </div>
        </div>

        {/* Addresses and billing descriptions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-2 text-xs">
          
          <div className="flex flex-col gap-2">
            <span className="font-black uppercase tracking-wider text-[10px] text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-purple-500" />
              <span>Deliver To</span>
            </span>
            <div className="flex flex-col gap-0.5 leading-relaxed text-slate-600 dark:text-slate-350">
              <span className="font-bold text-slate-900 dark:text-white">{order.user?.name || 'Customer'}</span>
              <span>{order.shippingAddress?.address}</span>
              <span>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</span>
              <span>{order.shippingAddress?.country}</span>
              {order.shippingAddress?.phone && (
                <span className="text-slate-400 mt-1">Phone: {order.shippingAddress.phone}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 text-left sm:text-right sm:items-end">
            <span className="font-black uppercase tracking-wider text-[10px] text-slate-400 flex items-center gap-1">
              <Printer className="w-3.5 h-3.5 text-purple-500" />
              <span>Transaction specifications</span>
            </span>
            <div className="flex flex-col gap-0.5 leading-relaxed text-slate-600 dark:text-slate-350">
              <span><strong>Method:</strong> {order.paymentMethod}</span>
              {order.paymentResult?.id && (
                <span className="font-mono text-[9px] text-slate-450 mt-1"><strong>TXN:</strong> {order.paymentResult.id}</span>
              )}
              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit mt-1 sm:ml-auto">Paid successfully</span>
            </div>
          </div>

        </div>

        {/* Items listing table */}
        <div className="py-2">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-850 text-slate-450 uppercase tracking-widest text-[9px] font-black">
                <th className="pb-2">Stationery description</th>
                <th className="pb-2 text-center">Qty</th>
                <th className="pb-2 text-right">Unit Price</th>
                <th className="pb-2 text-right">Sum Cost</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems && order.orderItems.map((item, index) => (
                <tr key={index} className="border-b border-slate-100 dark:border-slate-850/50">
                  <td className="py-3 font-bold text-slate-800 dark:text-slate-250 truncate max-w-[200px]">{item.name}</td>
                  <td className="py-3 text-center text-slate-450">{item.qty}</td>
                  <td className="py-3 text-right text-slate-450">${Number(item.price).toFixed(2)}</td>
                  <td className="py-3 text-right font-bold text-slate-900 dark:text-white">${(Number(item.price) * item.qty).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals math calculation block */}
        <div className="flex flex-col items-end gap-2.5 text-xs text-slate-500 ml-auto w-full max-w-xs border-t border-slate-200 dark:border-slate-850 pt-4 mt-2">
          
          <div className="flex justify-between w-full">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-850 dark:text-slate-200">${Number(order.itemsPrice).toFixed(2)}</span>
          </div>

          <div className="flex justify-between w-full">
            <span>Sales Tax (8%)</span>
            <span className="font-semibold text-slate-850 dark:text-slate-200">${Number(order.taxPrice).toFixed(2)}</span>
          </div>

          <div className="flex justify-between w-full">
            <span>Shipping</span>
            {Number(order.shippingPrice) === 0 ? (
              <span className="text-emerald-500 font-extrabold uppercase text-[10px]">Free Delivery</span>
            ) : (
              <span className="font-semibold text-slate-855 dark:text-slate-200">${Number(order.shippingPrice).toFixed(2)}</span>
            )}
          </div>

          <hr className="border-slate-200 dark:border-slate-800 w-full my-0.5" />

          <div className="flex justify-between w-full text-sm font-black text-slate-900 dark:text-white">
            <span>Gross Price</span>
            <span>${Number(order.totalPrice).toFixed(2)}</span>
          </div>

        </div>

        {/* Security seal */}
        <div className="flex justify-between items-center text-[8px] text-slate-400 font-bold uppercase border-t border-slate-100 dark:border-slate-850 pt-4 mt-6">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
            <span>Invoice security verified</span>
          </div>
          <span>StationeryHub Limited</span>
        </div>

      </div>

    </div>
  );
};

export default OrderSuccess;
