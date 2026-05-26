import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Lock, Smartphone, HelpCircle, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';

const EsewaModal = ({ isOpen, onClose, onSuccess, amount }) => {
  const [step, setStep] = useState(1); // 1: Login, 2: OTP, 3: Success processing, 4: Finished
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Conversion rate: 1 USD = 133 NPR (Nepalese Rupee)
  const nprAmount = (amount * 133).toFixed(2);
  const formattedNpr = new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR' }).format(nprAmount);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when closed
      setStep(1);
      setPhone('');
      setPin('');
      setOtp('');
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!phone || !pin) {
      setError('Please enter your eSewa ID and PIN.');
      return;
    }

    if (phone !== '9806000000' || pin !== '1234') {
      setError('Invalid test credentials. Please use Phone: 9806000000 and PIN: 1234.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!otp) {
      setError('Please enter the verification OTP code.');
      return;
    }

    if (otp !== '123456') {
      setError('Invalid OTP code. Please use simulated code: 123456.');
      return;
    }

    setLoading(true);
    setStep(3);

    // Simulate verification delay and success
    setTimeout(() => {
      setStep(4);
      setTimeout(() => {
        onSuccess({
          id: 'ESEWA_TXN_' + Math.random().toString(36).substring(2, 9).toUpperCase(),
          status: 'COMPLETE',
          email_address: 'esewa_wallet_9806000000@esewa.com.np'
        });
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-300">
      
      {/* Main Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-300">
        
        {/* eSewa Brand Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-white text-emerald-600 text-[10px] font-black rounded-md uppercase tracking-wider">
              Offline Simulation
            </span>
          </div>
          
          <div className="flex justify-between items-end mt-4">
            <div>
              <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest">Merchant Name</p>
              <h3 className="font-extrabold text-base text-white tracking-tight">StationeryHub Nepal</h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest">Payable Amount</p>
              <p className="text-xl font-black text-white tracking-tight">{formattedNpr}</p>
              <p className="text-[9px] text-emerald-100 opacity-80">(${amount.toFixed(2)} USD converted)</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          
          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-xl text-xs font-bold">
              {error}
            </div>
          )}

          {/* STEP 1: LOGIN */}
          {step === 1 && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div className="text-center mb-4">
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">eSewa Mobile Wallet Secure Log-In</h4>
                <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-1">
                  Connect your Nepalese eSewa account to pay instantly.
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">eSewa ID (Mobile Number)</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="9806000000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">eSewa Security PIN</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••"
                      maxLength={4}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Guide/Help Card */}
              <div className="p-3 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-xl border border-emerald-500/15 flex items-start gap-2 text-[10px] text-emerald-700 dark:text-emerald-400 mt-4 leading-relaxed font-semibold">
                <HelpCircle className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                <div>
                  <p className="font-bold">Test Credentials Guide:</p>
                  <p className="opacity-90 mt-0.5">Use Wallet ID: <code className="bg-emerald-500/10 px-1 rounded text-emerald-600 dark:text-emerald-300">9806000000</code> and PIN: <code className="bg-emerald-500/10 px-1 rounded text-emerald-600 dark:text-emerald-300">1234</code> to authenticate.</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-4 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:opacity-95 shadow-lg flex justify-center items-center gap-1.5 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting Securely...</span>
                  </>
                ) : (
                  <>
                    <span>Login & Proceed</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="space-y-4 text-left">
              <div className="text-center mb-4">
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">Two-Factor OTP Security Check</h4>
                <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-1">
                  Enter the 6-digit confirmation code dispatched to +977-9806000000.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">6-Digit OTP Code</label>
                <input
                  type="text"
                  required
                  placeholder="123456"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-center tracking-[0.5em] font-mono font-bold text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div className="p-3 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-xl border border-emerald-500/15 flex items-start gap-2 text-[10px] text-emerald-700 dark:text-emerald-400 mt-4 leading-relaxed font-semibold">
                <HelpCircle className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                <div>
                  <p className="font-bold">Simulated OTP Code:</p>
                  <p className="opacity-90 mt-0.5">Please input OTP code <code className="bg-emerald-500/10 px-1 rounded text-emerald-600 dark:text-emerald-300">123456</code> to successfully verify payment.</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-4 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:opacity-95 shadow-lg flex justify-center items-center gap-1.5 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying OTP...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify & Confirm Payment</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 3: SUCCESS PROCESSING */}
          {step === 3 && (
            <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
              <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">Processing Payment Ledger...</h4>
              <p className="text-[10px] text-slate-450 dark:text-slate-400 max-w-xs leading-relaxed">
                eSewa is communicating securely with StationeryHub to confirm payment credentials and dispatch order details.
              </p>
            </div>
          )}

          {/* STEP 4: PAYMENT FINISHED */}
          {step === 4 && (
            <div className="py-8 flex flex-col items-center justify-center gap-4 text-center animate-scale-up">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                Success
              </span>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Payment Verified Successfully!</h4>
              <p className="text-[10px] text-slate-450 dark:text-slate-400 max-w-xs leading-relaxed">
                Thank you! Redirecting you back to your invoice receipt timeline shortly...
              </p>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[8px] text-slate-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>eSewa Secure Payment Gateway</span>
          </span>
          <span>Nepal</span>
        </div>

      </div>
      
    </div>
  );
};

export default EsewaModal;
