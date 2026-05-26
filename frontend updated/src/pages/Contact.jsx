import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, AlertCircle, Sparkles } from 'lucide-react';

const Contact = () => {
  const [ticketId, setTicketId] = useState('');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMsg, setFormMsg] = useState('');

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (formName.trim() && formEmail.trim() && formMsg.trim()) {
      const generatedId = 'SH-TKT-' + Math.floor(100000 + Math.random() * 900000);
      setTicketId(generatedId);
      setFormName('');
      setFormEmail('');
      setFormMsg('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left dark:grad-bg min-h-screen">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start pt-6">
        
        {/* Left Column: Contacts Info */}
        <div className="flex flex-col gap-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Connect With Us</span>
          </div>

          <h1 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">
            How can we inspire <br />
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Your Workspace?</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
            Have query details about bulk ordering executive gel pens? Want to tracking your Expandable Document File shipment status? Need design consultations? Our team is active 24/7.
          </p>

          <div className="flex flex-col gap-4 mt-2">
            
            <div className="flex gap-4 items-center p-4 rounded-2xl glass bg-white/40 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-800/40">
              <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl border border-purple-500/20">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Corporate Headquarters</span>
                <span className="text-xs font-bold text-slate-750 dark:text-slate-350">Maitighar, Kathmandu, Nepal</span>
              </div>
            </div>

            <div className="flex gap-4 items-center p-4 rounded-2xl glass bg-white/40 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-800/40">
              <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-500/20">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Support Mailbox</span>
                <span className="text-xs font-bold text-slate-750 dark:text-slate-350">support@stationeryhub.com</span>
              </div>
            </div>

            <div className="flex gap-4 items-center p-4 rounded-2xl glass bg-white/40 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-800/40">
              <div className="p-3 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl border border-teal-500/20">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Call Hotline</span>
                <span className="text-xs font-bold text-slate-750 dark:text-slate-350">+977 1-4400000</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Support Ticket form */}
        <div className="flex flex-col gap-4">
          
          {ticketId && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold flex flex-col gap-1 leading-relaxed">
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Support Ticket Created Successfully!</span>
              </span>
              <span>Your reference ID is <code className="text-purple-500 font-black">{ticketId}</code>. Our helpdesk will inspect your query details and reply within 12 hours.</span>
            </div>
          )}

          <form onSubmit={handleSupportSubmit} className="flex flex-col gap-4 p-6 rounded-2xl glass bg-white/70 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/40">
            <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1">
              <HelpCircle className="w-4.5 h-4.5 text-purple-500" />
              <span>Submit secure Support Ticket</span>
            </span>

            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Your Name</label>
              <input
                type="text"
                required
                placeholder="Jane Doe"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
              <input
                type="email"
                required
                placeholder="jane@example.com"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Support Details / Question</label>
              <textarea
                rows="4"
                required
                placeholder="How can we help? Please detail custom specifications, bulk quantities, or order tracking IDs..."
                value={formMsg}
                onChange={(e) => setFormMsg(e.target.value)}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-95 shadow-md flex justify-center items-center gap-1.5 glow-btn"
            >
              <Send className="w-4 h-4" />
              <span>Submit secure ticket</span>
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};

export default Contact;
