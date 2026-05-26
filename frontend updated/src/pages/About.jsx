import React, { useState } from 'react';
import { BookOpen, Award, Users, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

const About = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'Where do you source your stationery products from?',
      a: 'We partner directly with leading artisanal writing instrument makers and premium mills across Japan, Germany, and Switzerland, guaranteeing high-grade, bleeding-resistant, acid-free grids and fine tips.'
    },
    {
      q: 'Is there a shipping charge for international orders?',
      a: 'We offer free standard shipping globally for all orders exceeding $50. For smaller orders, a standard fee of $4.99 is assessed at checkout.'
    },
    {
      q: 'Can I return stationery items if I change my mind?',
      a: 'Yes, we accommodate hassle-free returns within 30 days of invoice receipt, provided notebooks and pens are unopened and in their original packaging.'
    },
    {
      q: 'Are your school bags ergonomic?',
      a: 'Absolutely. Every school backpack we host has been engineered with cushioned lumbar support, adjustable S-curve shoulder straps, and premium water-resistant canvases to prevent back strain.'
    }
  ];

  const handleToggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left dark:grad-bg min-h-screen">
      
      {/* Brand narrative block */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 pt-6">
        <div className="flex flex-col gap-6 text-left animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Heritage</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white leading-[1.1]">
            Inspiring Creativity & <br />
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Desk Harmony</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Founded in 2026, StationeryHub was born out of a simple, beautiful mission: to eliminate desk clutter and inspire everyday minds with visual, functional stationery products. We believe that fine-tipped executive writing pens, twin-spiral Morandi journals, pastel highlighters, and modular expansion files aren't just utilities—they are bridges to creativity, design, and focus.
          </p>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Every notebook grid, canvas backpack strap, and watercolor palette in our catalog undergoes extreme testing before hitting our shelves, ensuring our creators receive premium craftsmanship.
          </p>

          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/50 dark:border-slate-800/40">
            <div className="flex gap-2 items-center text-slate-800 dark:text-white">
              <BookOpen className="w-5 h-5 text-purple-500" />
              <div className="flex flex-col">
                <span className="text-sm font-black">200+</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Notebook Styles</span>
              </div>
            </div>
            <div className="flex gap-2 items-center text-slate-800 dark:text-white">
              <Award className="w-5 h-5 text-purple-500" />
              <div className="flex flex-col">
                <span className="text-sm font-black">100%</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Quality Inspected</span>
              </div>
            </div>
            <div className="flex gap-2 items-center text-slate-800 dark:text-white">
              <Users className="w-5 h-5 text-purple-500" />
              <div className="flex flex-col">
                <span className="text-sm font-black">10K+</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Minds Inspired</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center items-center animate-float">
          <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 opacity-25 blur-2xl" />
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600"
            alt="Office workspace with stationery"
            className="w-full max-w-sm rounded-3xl border border-white/20 dark:border-slate-800/60 shadow-2xl z-10 opacity-90"
          />
        </div>
      </section>

      {/* Accordion FAQ Grid */}
      <section className="glass rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800/40">
        <span className="text-xs font-bold text-purple-500 uppercase tracking-widest text-center block mb-1">Got Questions?</span>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-8">Frequently Asked Questions</h2>
        
        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200/50 dark:border-slate-850 bg-white/40 dark:bg-slate-950/20 overflow-hidden"
              >
                <button
                  onClick={() => handleToggleFaq(index)}
                  className="w-full px-5 py-4 flex justify-between items-center text-xs font-bold text-slate-800 dark:text-slate-200 text-left hover:text-purple-500 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-purple-500" /> : <ChevronDown className="w-4 h-4 text-purple-500" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-850 pt-3 leading-relaxed animate-fade-in-up">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default About;
