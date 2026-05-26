import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { HelpCircle, Mail, Lock, Key, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Stage 1: Request PIN, Stage 2: Enter PIN & Reset
  const [stage, setStage] = useState(1);

  // Form State
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [mockPin, setMockPin] = useState('');

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', text: '' });
    setMockPin('');

    if (!email) {
      setFeedback({ type: 'error', text: 'Please enter your registered email address.' });
      return;
    }

    setLoading(true);
    try {
      const { ok, data } = await api.auth.forgotPassword(email);

      if (ok) {
        setMockPin(data.token);
        setFeedback({
          type: 'success',
          text: 'Reset instructions generated successfully! We generated a secure PIN for your testing below.'
        });
        setStage(2);
      } else {
        setFeedback({ type: 'error', text: data.message || 'Failed to request reset token.' });
      }
    } catch (error) {
      setFeedback({ type: 'error', text: 'Server connection error.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', text: '' });

    if (!token || !password || !confirmPassword) {
      setFeedback({ type: 'error', text: 'Please fill out all reset credentials.' });
      return;
    }

    if (password !== confirmPassword) {
      setFeedback({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (password.length < 6) {
      setFeedback({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);
    try {
      const { ok, data } = await api.auth.resetPassword(email, token, password);

      if (ok) {
        setFeedback({ type: 'success', text: 'Your password was reset successfully!' });
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setFeedback({ type: 'error', text: data.message || 'Reset execution failed.' });
      }
    } catch (error) {
      setFeedback({ type: 'error', text: 'Server connection error.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden dark:grad-bg px-4 py-16">
      
      {/* Visual backdrops */}
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] rounded-full glow-purple pointer-events-none opacity-30" />
      <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] rounded-full glow-blue pointer-events-none opacity-30" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl glass bg-white/70 dark:bg-slate-900/30 p-8 border border-slate-200/50 dark:border-slate-800/40 shadow-2xl flex flex-col gap-6 animate-fade-in-up">
        
        {/* Brand layout */}
        <div className="text-center flex flex-col items-center gap-1.5">
          <div className="p-2.5 bg-gradient-to-tr from-blue-500 to-purple-600 text-white rounded-2xl shadow-md w-fit animate-float">
            <HelpCircle className="w-5 h-5" />
          </div>
          
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-2">Password Reset</h1>
          <p className="text-[11px] text-slate-400">Recover your account credentials securely.</p>
        </div>

        {feedback.text && (
          <div className={`p-4 rounded-2xl text-xs font-semibold flex flex-col gap-1 border text-left ${
            feedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-605 dark:text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
          }`}>
            <span className="flex items-center gap-1.5 font-bold">
              {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              <span>{feedback.type === 'success' ? 'Success' : 'Error'}</span>
            </span>
            <span className="leading-relaxed">{feedback.text}</span>
          </div>
        )}

        {/* STAGE 1: REQUEST PIN FORM */}
        {stage === 1 && (
          <form onSubmit={handleRequestToken} className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Registered Email Address</label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-95 shadow-lg active:scale-[0.98] transition-all flex justify-center items-center gap-1"
            >
              <span>{loading ? 'Sending PIN...' : 'Send Reset PIN'}</span>
            </button>
          </form>
        )}

        {/* STAGE 2: ENTER PIN AND RESET */}
        {stage === 2 && (
          <form onSubmit={handleResetSubmit} className="flex flex-col gap-4 text-left">
            
            {/* Show mock pin prompt */}
            {mockPin && (
              <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-xs text-left mb-2">
                <span className="font-bold text-purple-500">Local Testing PIN Code:</span> <br />
                Copy this 6-digit token PIN: <code className="text-purple-600 font-extrabold text-sm ml-1 select-all">{mockPin}</code>
              </div>
            )}

            {/* Email (Disabled summary) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-slate-500 text-xs focus:outline-none cursor-not-allowed"
              />
            </div>

            {/* Reset PIN Code Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">6-Digit Reset PIN</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  placeholder="Enter 6-digit PIN..."
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none"
                />
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5" />
              </div>
            </div>

            {/* New Password input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">New Password</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 rounded absolute right-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Confirm New Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none"
              />
            </div>

            <div className="flex justify-between gap-4 mt-2">
              <button
                type="button"
                onClick={() => setStage(1)}
                className="px-4 py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-2xl text-xs font-bold text-slate-650 dark:text-slate-350"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-grow py-3.5 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-95 shadow-lg active:scale-[0.98] flex justify-center items-center gap-1"
              >
                <span>{loading ? 'Updating Password...' : 'Reset Password'}</span>
              </button>
            </div>
          </form>
        )}

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/50 dark:border-slate-850 pt-4 mt-2">
          <span>Remember your credentials? </span>
          <Link to="/login" className="text-purple-500 font-bold hover:underline">
            Sign In here
          </Link>
        </div>

      </div>

    </div>
  );
};

export default ForgotPassword;
