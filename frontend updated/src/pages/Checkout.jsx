import React, { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import EsewaModal from '../components/EsewaModal';
import { MapPin, CreditCard, ShoppingBag, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';

const Checkout = () => {
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice, clearCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);
  
  const navigate = useNavigate();

  // Route protection inside component
  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  // Active stage
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review

  // Payment Method Selection
  const [paymentMethod, setPaymentMethod] = useState('Credit/Debit Card'); // 'Credit/Debit Card' or 'eSewa'
  const [esewaModalOpen, setEsewaModalOpen] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState(null);

  // Shipping Form State
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  // Credit Card Form State
  const [paymentData, setPaymentData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const [cardFlipped, setCardFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleShippingChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    let { name, value } = e.target;
    if (name === 'cardNumber') {
      value = value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim().substring(0, 19);
    }
    if (name === 'expiry') {
      value = value.replace(/\//g, '').replace(/(\d{2})/g, '$1/').trim().substring(0, 5);
      if (value.endsWith('/')) value = value.substring(0, 2);
    }
    if (name === 'cvv') {
      value = value.substring(0, 4);
    }
    setPaymentData({ ...paymentData, [name]: value });
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    const { address, city, postalCode, country, phone } = shippingAddress;
    if (!address || !city || !postalCode || !country || !phone) {
      setErrorMsg('Please fill out all shipping fields.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const { cardName, cardNumber, expiry, cvv } = paymentData;
    if (!cardName || !cardNumber || !expiry || !cvv) {
      setErrorMsg('Please fill out all payment details.');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  // Programmatically create and submit real eSewa Sandbox Form (NPR Wallet)
  const submitEsewaForm = (params) => {
    const form = document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute('action', 'https://rc-epay.esewa.com.np/api/epay/main/v2');

    Object.keys(params).forEach((key) => {
      const input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', key);
      input.setAttribute('value', params[key]);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const orderItems = cartItems.map((item) => ({
        name: item.product.name,
        qty: item.qty,
        image: item.product.images[0],
        price: item.product.price,
        product: item.product._id,
      }));

      const orderPayload = {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      const activeToken = token || localStorage.getItem('token') || localStorage.getItem('sh_token');
      const { ok, data } = await api.orders.createOrder(activeToken, orderPayload);

      if (ok) {
        if (paymentMethod === 'eSewa') {
          // Detect online or offline mode by searching for backend eSewa signature params
          if (data.esewaParams) {
            // Online mode: redirect to eSewa sandbox site
            submitEsewaForm(data.esewaParams);
          } else {
            // Offline mode: open our interactive simulated portal overlay
            setPendingOrderId(data._id);
            setEsewaModalOpen(true);
          }
        } else {
          // Regular Credit Card Checkout is immediately finalized
          clearCart();
          navigate(`/order-success/${data._id}`);
        }
      } else {
        throw new Error(data.message || 'Failed to place order.');
      }

    } catch (error) {
      setErrorMsg(error.message || 'An unexpected connection error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleEsewaSuccess = async (paymentResult) => {
    setEsewaModalOpen(false);
    setLoading(true);
    try {
      const activeToken = token || localStorage.getItem('token') || localStorage.getItem('sh_token');
      const { ok, data } = await api.orders.payOrder(activeToken, pendingOrderId, paymentResult);
      if (ok) {
        clearCart();
        navigate(`/order-success/${pendingOrderId}`);
      } else {
        throw new Error(data.message || 'Failed to update order payment status.');
      }
    } catch (error) {
      setErrorMsg(error.message || 'Verification connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left dark:grad-bg min-h-screen">
      
      {/* Wizard Progress steps header */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
          
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-1.5 pb-2 border-b-2 transition-colors ${
              step >= 1 ? 'text-purple-500 border-purple-500' : 'border-transparent'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Shipping</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-350" />

          <button
            onClick={() => step >= 2 && setStep(2)}
            disabled={step < 2}
            className={`flex items-center gap-1.5 pb-2 border-b-2 transition-colors ${
              step >= 2 ? 'text-purple-500 border-purple-500' : 'border-transparent'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payment details</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-350" />

          <button
            disabled={step < 3}
            className={`flex items-center gap-1.5 pb-2 border-b-2 transition-colors ${
              step === 3 ? 'text-purple-500 border-purple-500' : 'border-transparent'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Complete Order</span>
          </button>

        </div>
      </div>

      {errorMsg && (
        <div className="max-w-3xl mx-auto p-4 mb-6 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-bold">
          {errorMsg}
        </div>
      )}

      {/* Steps configurations */}
      <div className="max-w-5xl mx-auto">
        
        {/* STEP 1: SHIPPING ADDRESS */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <form onSubmit={handleShippingSubmit} className="flex flex-col gap-4 p-6 rounded-2xl glass bg-white/70 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/40">
              <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">Shipping Information</span>
              
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Street Address</label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="Street name, apartment, suite number..."
                  value={shippingAddress.address}
                  onChange={handleShippingChange}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="Kathmandu"
                    value={shippingAddress.city}
                    onChange={handleShippingChange}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Postal/ZIP Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    placeholder="44600"
                    value={shippingAddress.postalCode}
                    onChange={handleShippingChange}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Country</label>
                  <input
                    type="text"
                    name="country"
                    required
                    placeholder="Nepal"
                    value={shippingAddress.country}
                    onChange={handleShippingChange}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-805 bg-white/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+977 98********"
                    value={shippingAddress.phone}
                    onChange={handleShippingChange}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-95 mt-4 shadow-md flex justify-center items-center gap-1"
              >
                <span>Continue to Payment</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>

            <div className="hidden lg:flex justify-center items-center h-full">
              <div className="text-center p-8 glass rounded-3xl max-w-sm flex flex-col gap-4 items-center">
                <div className="p-3.5 bg-purple-500/10 text-purple-600 rounded-full border border-purple-500/20">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white">Secure Delivery Shipping</h3>
                <p className="text-[11px] text-slate-450 leading-relaxed">
                  We supply safe package boxing and secure dispatch track keys within 24 hours of checkout completion.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PAYMENT METHOD & DETAILS */}
        {step === 2 && (
          <div className="flex flex-col gap-8">
            {/* Tab selector */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-widest text-left">Select Payment Gateway</span>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Credit/Debit Card')}
                  className={`flex items-center justify-center gap-2.5 p-4 rounded-2xl border-2 font-bold text-xs transition-all ${
                    paymentMethod === 'Credit/Debit Card'
                      ? 'border-purple-600 bg-purple-500/5 text-purple-600 dark:text-purple-400 dark:border-purple-500 shadow-md shadow-purple-500/5'
                      : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/10 text-slate-600 hover:border-slate-350 dark:text-slate-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Credit/Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('eSewa')}
                  className={`flex items-center justify-center gap-2.5 p-4 rounded-2xl border-2 font-bold text-xs transition-all ${
                    paymentMethod === 'eSewa'
                      ? 'border-emerald-600 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 dark:border-emerald-500 shadow-md shadow-emerald-500/5'
                      : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/10 text-slate-600 hover:border-slate-350 dark:text-slate-400'
                  }`}
                >
                  <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[8px] font-black rounded uppercase tracking-wider">eSewa</span>
                  <span>eSewa Wallet</span>
                </button>
              </div>
            </div>

            {/* Render selected payment fields */}
            {paymentMethod === 'Credit/Debit Card' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-fade-in">
                {/* Interactive Credit Card visualizer */}
                <div className="flex justify-center items-center h-full">
                  <div className="w-[340px] h-[200px] card-perspective">
                    <div className={`w-full h-full relative card-inner cursor-pointer ${cardFlipped ? 'flipped' : ''}`}>
                      
                      {/* Front Side */}
                      <div className="card-front w-full h-full rounded-2xl bg-gradient-to-br from-indigo-650 via-purple-650 to-pink-650 text-white p-5 flex flex-col justify-between shadow-2xl overflow-hidden border border-white/20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-xl rounded-full" />
                        
                        <div className="flex justify-between items-center z-10">
                          <span className="text-[10px] font-black tracking-widest uppercase text-white/80">Secure Card</span>
                          <ShieldCheck className="w-5 h-5 text-white/80" />
                        </div>

                        <div className="text-center text-lg font-black tracking-widest font-mono py-2 z-10">
                          {paymentData.cardNumber || '•••• •••• •••• ••••'}
                        </div>

                        <div className="flex justify-between items-end z-10">
                          <div className="text-left flex flex-col">
                            <span className="text-[7px] text-white/70 uppercase font-bold tracking-widest">Cardholder Name</span>
                            <span className="text-xs font-bold uppercase truncate max-w-[180px]">
                              {paymentData.cardName || 'JOHN DOE'}
                            </span>
                          </div>
                          <div className="text-left flex flex-col">
                            <span className="text-[7px] text-white/70 uppercase font-bold tracking-widest">Expires</span>
                            <span className="text-xs font-bold font-mono">
                              {paymentData.expiry || 'MM/YY'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Back Side */}
                      <div className="card-back w-full h-full rounded-2xl bg-slate-900 text-white p-5 flex flex-col justify-between shadow-2xl border border-slate-800">
                        <div className="w-full h-10 bg-slate-950 -mx-5 mt-2" />
                        
                        <div className="flex items-center gap-4 py-2 mt-2">
                          <div className="w-48 h-8 bg-slate-800 rounded-md" />
                          <div className="flex flex-col text-left">
                            <span className="text-[6px] text-white/60 font-bold uppercase tracking-widest">CVV</span>
                            <span className="text-xs font-bold tracking-widest font-mono text-center px-2 py-0.5 bg-white text-slate-900 rounded-md">
                              {paymentData.cvv || '•••'}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[7px] text-white/40 font-semibold tracking-wider">
                          <span>Secure validation system</span>
                          <span>MERN Hub</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Payment Details Form */}
                <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4 p-6 rounded-2xl glass bg-white/70 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/40">
                  <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">Secure Card details</span>
                  
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Cardholder Name</label>
                    <input
                      type="text"
                      name="cardName"
                      required
                      placeholder="Card owner full name..."
                      value={paymentData.cardName}
                      onChange={handlePaymentChange}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      required
                      placeholder="4000 1234 5678 9010"
                      value={paymentData.cardNumber}
                      onChange={handlePaymentChange}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-white/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Expiration (MM/YY)</label>
                      <input
                        type="text"
                        name="expiry"
                        required
                        placeholder="12/28"
                        value={paymentData.expiry}
                        onChange={handlePaymentChange}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">CVV Code</label>
                      <input
                        type="password"
                        name="cvv"
                        required
                        placeholder="•••"
                        value={paymentData.cvv}
                        onChange={handlePaymentChange}
                        onFocus={() => setCardFlipped(true)}
                        onBlur={() => setCardFlipped(false)}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between gap-4 mt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-105 dark:hover:bg-slate-850 rounded-2xl text-xs font-bold text-slate-650 dark:text-slate-350"
                    >
                      Back
                    </button>
                    
                    <button
                      type="submit"
                      className="flex-grow py-3.5 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-95 shadow-md flex justify-center items-center gap-1"
                    >
                      <span>Review checkout Order</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-fade-in">
                {/* eSewa Info Box */}
                <div className="flex justify-center items-center h-full">
                  <div className="p-8 glass bg-white/60 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 rounded-3xl max-w-sm flex flex-col gap-4 items-center text-center">
                    <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-full border border-emerald-500/20">
                      <span className="text-sm font-black uppercase text-emerald-600 tracking-wider">eSewa Wallet</span>
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-white">Nepal's Leading Payment Gateway</h3>
                    <p className="text-[11px] text-slate-450 dark:text-slate-400 leading-relaxed">
                      Pay securely with eSewa Mobile Wallet. Seamless checkouts in Nepalese Rupee (NPR).
                    </p>
                    <div className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-855 flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-500">Exchange Rate:</span>
                      <span className="font-black text-slate-800 dark:text-white">$1.00 USD = 133.00 NPR</span>
                    </div>
                  </div>
                </div>

                {/* eSewa Quick Instructions Form */}
                <div className="flex flex-col gap-4 p-6 rounded-2xl glass bg-white/70 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/40 text-left">
                  <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">eSewa Instructions</span>
                  
                  <div className="flex flex-col gap-3.5 text-xs text-slate-600 dark:text-slate-350">
                    <p className="font-bold text-slate-850 dark:text-white">To complete payment using eSewa:</p>
                    <ul className="list-decimal pl-4 space-y-2 text-[11px] leading-relaxed">
                      <li>Choose eSewa Wallet and review your converted NPR invoice on the next step.</li>
                      <li>In online mode, you will be redirected to the secure sandbox payment portal.</li>
                      <li>In offline mode, you will use our interactive eSewa mock interface.</li>
                      <li>After verification, your order is instantly finalized and marked as Paid.</li>
                    </ul>
                  </div>

                  <div className="flex justify-between gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-105 dark:hover:bg-slate-850 rounded-2xl text-xs font-bold text-slate-650 dark:text-slate-350"
                    >
                      Back
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-grow py-3.5 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:opacity-95 shadow-md flex justify-center items-center gap-1"
                    >
                      <span>Review checkout Order</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: ORDER SUMMARY REVIEW */}
        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fade-in">
            
            {/* Left detail summaries lists */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Shipping review */}
              <div className="p-5 rounded-2xl glass bg-white/70 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/40 text-left">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-purple-500" />
                  <span>Shipping Address details</span>
                </span>
                <div className="grid grid-cols-2 mt-4 text-xs gap-2 leading-relaxed text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-800 dark:text-slate-300">Street</span>
                  <span>{shippingAddress.address}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-300">City / Postal</span>
                  <span>{shippingAddress.city}, {shippingAddress.postalCode}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-300">Country</span>
                  <span>{shippingAddress.country}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-300">Phone</span>
                  <span>{shippingAddress.phone}</span>
                </div>
              </div>

              {/* Payment Review */}
              <div className="p-5 rounded-2xl glass bg-white/70 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/40 text-left">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  {paymentMethod === 'Credit/Debit Card' ? (
                    <>
                      <CreditCard className="w-4 h-4 text-purple-500" />
                      <span>Card Billing info</span>
                    </>
                  ) : (
                    <>
                      <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[8px] font-black rounded uppercase tracking-wider">eSewa</span>
                      <span>eSewa Wallet Payment</span>
                    </>
                  )}
                </span>
                {paymentMethod === 'Credit/Debit Card' ? (
                  <div className="grid grid-cols-2 mt-4 text-xs gap-2 leading-relaxed text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-slate-800 dark:text-slate-300">Card Owner</span>
                    <span className="uppercase">{paymentData.cardName}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-300">Card Number</span>
                    <span>•••• •••• •••• {paymentData.cardNumber.substring(15)}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-300">Expiration</span>
                    <span>{paymentData.expiry}</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 mt-4 text-xs gap-2 leading-relaxed text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-slate-800 dark:text-slate-300">Gateway Brand</span>
                    <span>eSewa Mobile Wallet (Nepal)</span>
                    <span className="font-bold text-slate-800 dark:text-slate-300">Wallet Account ID</span>
                    <span>+977 9806000000 (Test Sandbox)</span>
                    <span className="font-bold text-slate-800 dark:text-slate-300">Total NPR Amount</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-450">Rs. {(totalPrice * 133).toFixed(2)}</span>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Checkout Place Order trigger */}
            <div className="flex flex-col gap-6 p-6 rounded-2xl glass bg-white/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/40 text-left">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-3 border-b border-slate-200/50 dark:border-slate-800/40">Review Checkout</span>
              
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto mb-2 pr-1">
                {cartItems.map((item) => (
                  <div key={item.product._id} className="flex justify-between items-center gap-2 text-[10px] text-slate-505 dark:text-slate-400 py-1 border-b border-slate-100 dark:border-slate-850">
                    <span className="font-bold text-slate-850 dark:text-slate-300 truncate max-w-[160px]">
                      {item.product.name}
                    </span>
                    <span>{item.qty}x @ ${(item.product.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2.5 text-xs text-slate-550">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">${itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Sales Tax (8%)</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">${taxPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping Fee</span>
                  {shippingPrice === 0 ? (
                    <span className="text-emerald-500 font-extrabold uppercase text-[10px]">Free Delivery</span>
                  ) : (
                    <span className="font-semibold text-slate-800 dark:text-slate-200">${shippingPrice.toFixed(2)}</span>
                  )}
                </div>

                <hr className="border-slate-200 dark:border-slate-855 my-1" />

                <div className="flex justify-between items-center text-sm font-black text-slate-900 dark:text-white">
                  <span>Net Price</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>

                {paymentMethod === 'eSewa' && (
                  <div className="flex justify-between items-center text-xs font-black text-emerald-600 dark:text-emerald-450 mt-1">
                    <span>NPR Total (Rs.)</span>
                    <span>Rs. {(totalPrice * 133).toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2.5 mt-2">
                
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className={`flex items-center justify-center gap-1.5 w-full py-3.5 rounded-2xl text-xs font-black text-white shadow-lg disabled:opacity-50 active:scale-[0.98] transition-all duration-300 ${
                    paymentMethod === 'eSewa'
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:opacity-95 shadow-emerald-500/10'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-95'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {loading 
                      ? 'Processing Checkout...' 
                      : paymentMethod === 'eSewa' 
                        ? 'Pay with eSewa Wallet' 
                        : 'Confirm checkout & Pay'
                    }
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-center w-full py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-105 dark:hover:bg-slate-850 rounded-2xl text-xs font-bold text-slate-650 dark:text-slate-350"
                >
                  Adjust Billing details
                </button>

              </div>

              {/* Verification seals */}
              <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase mt-2">
                <ShieldCheck className="w-4 h-4 text-purple-500" />
                <span>Verification checkout secure</span>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Offline eSewa Simulated Wallet Overlay */}
      <EsewaModal
        isOpen={esewaModalOpen}
        onClose={() => setEsewaModalOpen(false)}
        onSuccess={handleEsewaSuccess}
        amount={totalPrice}
      />

    </div>
  );
};

export default Checkout;
