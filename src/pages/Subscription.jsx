import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Subscription = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [billingCycle, setBillingCycle] = useState('Monthly');
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [showPaymentSheet, setShowPaymentSheet] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUpgrade = (planType) => {
        setSelectedPlan(planType);
        setShowPaymentSheet(true);
    };

    const handlePayment = async () => {
        if (!selectedPlan) return;

        setLoading(true);
        try {
            if (paymentMethod === 'card') {
                // Stripe Checkout
                const response = await api.post('/stripe/checkout', {
                    plan: selectedPlan,
                    billingCycle: billingCycle.toLowerCase()
                });

                if (response.data.url) {
                    window.location.href = response.data.url;
                }
            } else {
                // PayPal or Crypto - à implémenter
                alert(`${paymentMethod} payment coming soon!`);
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white overflow-x-hidden">
            {/* Top Navigation Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center p-4 justify-between max-w-md mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                    >
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </button>
                    <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">Premium Subscriptions</h2>
                    <div className="w-10"></div>
                </div>
            </div>

            <main className="pt-20 pb-40 max-w-md mx-auto px-4">
                {/* Headline */}
                <div className="py-6">
                    <h2 className="text-3xl font-extrabold leading-tight text-center tracking-tight">
                        Unlock the Full Power of <span className="text-primary">FootballHub</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-center mt-2 text-sm">
                        Elevate your game with elite insights and real-time data.
                    </p>
                </div>

                {/* Billing Cycle Toggle */}
                <div className="flex py-3 mb-4">
                    <div className="flex h-12 flex-1 items-center justify-center rounded-xl bg-slate-200 dark:bg-[#232f48] p-1.5 shadow-inner">
                        <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 ${billingCycle === 'Monthly' ? 'bg-white dark:bg-background-dark shadow-sm text-primary dark:text-white' : 'text-slate-500 dark:text-[#92a4c9]'} text-sm font-semibold transition-all`}>
                            <span className="truncate">Monthly</span>
                            <input
                                checked={billingCycle === 'Monthly'}
                                onChange={() => setBillingCycle('Monthly')}
                                className="invisible w-0"
                                name="billing-cycle"
                                type="radio"
                                value="Monthly"
                            />
                        </label>
                        <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 ${billingCycle === 'Yearly' ? 'bg-white dark:bg-background-dark shadow-sm text-primary dark:text-white' : 'text-slate-500 dark:text-[#92a4c9]'} text-sm font-semibold transition-all`}>
                            <span className="truncate">Yearly (Save 20%)</span>
                            <input
                                checked={billingCycle === 'Yearly'}
                                onChange={() => setBillingCycle('Yearly')}
                                className="invisible w-0"
                                name="billing-cycle"
                                type="radio"
                                value="Yearly"
                            />
                        </label>
                    </div>
                </div>

                {/* Pricing Cards List */}
                <div className="space-y-4">
                    {/* Free Plan */}
                    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 dark:border-[#324467] bg-white dark:bg-[#192233] p-6 shadow-sm transition-transform active:scale-95">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest">Starter</h3>
                                <h1 className="text-2xl font-black">Free</h1>
                            </div>
                            <p className="flex items-baseline gap-1">
                                <span className="text-3xl font-black tracking-tight">$0</span>
                                <span className="text-slate-500 text-sm font-medium">/mo</span>
                            </p>
                        </div>
                        <div className="space-y-3">
                            <div className="text-[14px] font-medium flex gap-3 items-center">
                                <span className="material-symbols-outlined text-emerald-500 text-xl">check_circle</span>
                                Ad-supported experience
                            </div>
                            <div className="text-[14px] font-medium flex gap-3 items-center">
                                <span className="material-symbols-outlined text-emerald-500 text-xl">check_circle</span>
                                Limited AI predictions
                            </div>
                            <div className="text-[14px] font-medium flex gap-3 items-center">
                                <span className="material-symbols-outlined text-emerald-500 text-xl">check_circle</span>
                                Public chat access
                            </div>
                        </div>
                        <button
                            disabled
                            className="w-full h-12 bg-slate-100 dark:bg-[#232f48] rounded-xl font-bold text-slate-600 dark:text-white mt-2"
                        >
                            Current Plan
                        </button>
                    </div>

                    {/* Pro Plan (Most Popular) */}
                    <div className="relative flex flex-col gap-4 rounded-2xl border-2 border-primary pro-blue-gradient p-6 shadow-xl shadow-primary/20 transition-transform active:scale-95">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-primary text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
                            Most Popular
                        </div>
                        <div className="flex items-center justify-between text-white">
                            <div>
                                <h3 className="text-white/70 text-sm font-bold uppercase tracking-widest">Professional</h3>
                                <h1 className="text-2xl font-black">Pro</h1>
                            </div>
                            <p className="flex items-baseline gap-1">
                                <span className="text-3xl font-black tracking-tight">
                                    ${billingCycle === 'Monthly' ? '9.99' : '7.99'}
                                </span>
                                <span className="text-white/70 text-sm font-medium">/mo</span>
                            </p>
                        </div>
                        <div className="space-y-3 text-white">
                            <div className="text-[14px] font-medium flex gap-3 items-center">
                                <span className="material-symbols-outlined text-white text-xl">check_circle</span>
                                Unlimited AI Predictions
                            </div>
                            <div className="text-[14px] font-medium flex gap-3 items-center">
                                <span className="material-symbols-outlined text-white text-xl">check_circle</span>
                                No Ads (Seamless Experience)
                            </div>
                            <div className="text-[14px] font-medium flex gap-3 items-center">
                                <span className="material-symbols-outlined text-white text-xl">check_circle</span>
                                Expert Chat Rooms
                            </div>
                            <div className="text-[14px] font-medium flex gap-3 items-center">
                                <span className="material-symbols-outlined text-white text-xl">check_circle</span>
                                Advanced Player Stats
                            </div>
                        </div>
                        <button
                            onClick={() => handleUpgrade('pro')}
                            className="w-full h-12 bg-white text-primary rounded-xl font-bold mt-2 shadow-lg hover:bg-slate-50"
                        >
                            Upgrade to Pro
                        </button>
                    </div>

                    {/* Premium Plan (Elite) */}
                    <div className="flex flex-col gap-4 rounded-2xl border border-amber-400 premium-gold-gradient p-6 shadow-lg transition-transform active:scale-95">
                        <div className="flex items-center justify-between text-white">
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <h3 className="text-white/80 text-sm font-bold uppercase tracking-widest">Elite</h3>
                                    <span className="material-symbols-outlined text-sm">stars</span>
                                </div>
                                <h1 className="text-2xl font-black">Premium</h1>
                            </div>
                            <p className="flex items-baseline gap-1">
                                <span className="text-3xl font-black tracking-tight">
                                    ${billingCycle === 'Monthly' ? '19.99' : '15.99'}
                                </span>
                                <span className="text-white/80 text-sm font-medium">/mo</span>
                            </p>
                        </div>
                        <div className="space-y-3 text-white">
                            <div className="text-[14px] font-medium flex gap-3 items-center">
                                <span className="material-symbols-outlined text-white text-xl">check_circle</span>
                                All Pro Features Included
                            </div>
                            <div className="text-[14px] font-medium flex gap-3 items-center">
                                <span className="material-symbols-outlined text-white text-xl">check_circle</span>
                                1-on-1 AI Strategy Consultant
                            </div>
                            <div className="text-[14px] font-medium flex gap-3 items-center">
                                <span className="material-symbols-outlined text-white text-xl">check_circle</span>
                                VIP Early Access to Beta Tools
                            </div>
                            <div className="text-[14px] font-medium flex gap-3 items-center">
                                <span className="material-symbols-outlined text-white text-xl">check_circle</span>
                                Exclusive Monthly Giveaways
                            </div>
                        </div>
                        <button
                            onClick={() => handleUpgrade('elite')}
                            className="w-full h-12 bg-black/20 hover:bg-black/30 backdrop-blur-md border border-white/30 text-white rounded-xl font-bold mt-2"
                        >
                            Go Premium
                        </button>
                    </div>
                </div>
            </main>

            {/* Payment Bottom Sheet */}
            {showPaymentSheet && (
                <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" onClick={() => setShowPaymentSheet(false)}>
                    <div
                        className="fixed inset-x-0 bottom-0 flex flex-col items-stretch bg-background-light dark:bg-[#111722] rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.3)] border-t border-slate-200 dark:border-slate-800 animate-slide-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Handle Bar */}
                        <button
                            onClick={() => setShowPaymentSheet(false)}
                            className="flex h-8 w-full items-center justify-center"
                        >
                            <div className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-[#324467]"></div>
                        </button>

                        <div className="px-6 pb-10 pt-2">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h4 className="text-lg font-bold">Select Payment</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Secure encrypted checkout</p>
                                </div>
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full border-2 border-background-dark bg-white flex items-center justify-center p-1">
                                        <svg viewBox="0 0 48 32" className="w-full">
                                            <rect fill="#0066B2" width="48" height="32" rx="4" />
                                            <text x="24" y="20" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">VISA</text>
                                        </svg>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border-2 border-background-dark bg-white flex items-center justify-center p-1">
                                        <svg viewBox="0 0 48 32" className="w-full">
                                            <circle cx="18" cy="16" r="10" fill="#EB001B" />
                                            <circle cx="30" cy="16" r="10" fill="#F79E1B" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    onClick={() => setPaymentMethod('card')}
                                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-3 ${paymentMethod === 'card'
                                            ? 'border-primary bg-primary/10'
                                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-white/5'
                                        }`}
                                >
                                    <span className={`material-symbols-outlined text-2xl ${paymentMethod === 'card' ? 'text-primary' : ''}`}>credit_card</span>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Card</span>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod('paypal')}
                                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-3 ${paymentMethod === 'paypal'
                                            ? 'border-primary bg-primary/10'
                                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-white/5'
                                        }`}
                                >
                                    <span className="text-2xl font-bold text-[#003087]">P</span>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">PayPal</span>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod('crypto')}
                                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-3 ${paymentMethod === 'crypto'
                                            ? 'border-primary bg-primary/10'
                                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-white/5'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-amber-500 text-2xl">currency_bitcoin</span>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Crypto</span>
                                </button>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={loading}
                                className="w-full h-14 bg-primary text-white rounded-2xl font-black text-lg mt-8 shadow-xl shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Pay Now'}
                                <span className="material-symbols-outlined">arrow_forward_ios</span>
                            </button>

                            <p className="text-[10px] text-center text-slate-500 dark:text-slate-500 mt-4 leading-relaxed">
                                Recurring billing. Cancel anytime in App Store settings. <br />
                                By proceeding, you agree to our Terms of Service.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .pro-blue-gradient {
                    background: linear-gradient(135deg, #0d47a1 0%, #135bec 100%);
                }
                .premium-gold-gradient {
                    background: linear-gradient(135deg, #b8860b 0%, #daa520 50%, #ffd700 100%);
                }
                @keyframes slide-up {
                    from {
                        transform: translateY(100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default Subscription;
