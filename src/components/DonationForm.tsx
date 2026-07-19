'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Heart } from "lucide-react";
import { createClient } from '@/utils/supabase/client';

interface LencoPayResponse {
  status: string;
  reference: string;
  [key: string]: unknown;
}

interface FlutterwaveResponse {
  status: string;
  tx_ref: string;
  transaction_id?: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    LencoPay: {
      getPaid: (options: unknown) => void;
    };
    FlutterwaveCheckout: (options: unknown) => void;
  }
}

export default function DonationForm({ settings, recurringDonationsEnabled = false }: { settings: { lencoPublic?: string; lencoBaseUrl?: string; lencoName?: string; flutterwavePublic?: string; flutterwavePlanZMW?: string; flutterwavePlanUSD?: string }; recurringDonationsEnabled?: boolean }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [amount, setAmount] = useState('500');
  const [currency, setCurrency] = useState('ZMW');
  const [method, setMethod] = useState('flutterwave');
  const [frequency, setFrequency] = useState('one-time');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const supabase = createClient();

  const handleFrequencyChange = (newFreq: string) => {
    if (newFreq === 'monthly' && !recurringDonationsEnabled) {
      alert("Recurring Donations (Monthly) is only available on our PRO Plan. Please upgrade your subscription to unlock this premium capability!");
      return;
    }
    setFrequency(newFreq);
    if (newFreq === 'monthly') {
      setMethod('flutterwave');
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, [supabase.auth]);

  const handleLenco = () => {
    const publicKey = settings?.lencoPublic;

    if (!publicKey) {
        alert("Lenco gateway is not configured properly.");
        return;
    }

    if (typeof window.LencoPay !== 'undefined' && typeof window.LencoPay.getPaid === 'function') {
      const reference = `KCF-L-${userId || 'anon'}-${Date.now()}`;
      console.log("Initiating Lenco payment with reference:", reference);

      window.LencoPay.getPaid({
        key: publicKey,
        email: email,
        amount: parseFloat(amount), // Lenco v2 expects amount in decimal
        currency: currency,
        reference: reference,
        label: settings.lencoName,
        channels: ["card", "mobile-money"],
        customer: {
          firstName: name.split(' ')[0] || '',
          lastName: name.split(' ').slice(1).join(' ') || '',
          phone: phone,
        },
        onSuccess: function(response: LencoPayResponse) {
          console.log("Lenco payment success callback for reference:", response.reference);
          // Verify with backend
          fetch('/api/payments/lenco', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              reference: response.reference,
              supabaseUserId: userId,
              phone: phone
            })
          })
          .then(async verifyRes => {
            if (verifyRes.ok) {
              alert("Thank you for your donation!");
              window.location.reload();
            } else {
              const errorData = await verifyRes.json().catch(() => ({}));
              console.error("Lenco verification failed:", verifyRes.status, errorData);
              const message = errorData.error || errorData.message || "Please contact support.";
              alert(`Payment completed but verification failed: ${message}`);
            }
          })
          .catch(e => {
            console.error("Lenco verification error", e);
            alert("An error occurred during verification. Please contact support.");
          });
        },
        onClose: function() {
          console.log("Lenco window closed");
        },
        onConfirmationPending: function() {
          alert("Your donation is pending confirmation. We will update your record once it's successful.");
          window.location.reload();
        }
      });
    } else {
      alert("Lenco gateway is loading. Please try again.");
    }
  };

  const handleFlutterwave = () => {
    const publicKey = settings?.flutterwavePublic || process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;

    if (!publicKey) {
        alert("Payment gateway is not configured properly.");
        return;
    }

    if (typeof window.FlutterwaveCheckout === 'function') {
      const planId = frequency === 'monthly' ? (currency === 'ZMW' ? settings.flutterwavePlanZMW : settings.flutterwavePlanUSD) : undefined;

      window.FlutterwaveCheckout({
        public_key: publicKey,
        tx_ref: "KCF-" + Date.now(),
        amount: parseFloat(amount),
        currency: currency,
        payment_plan: planId || undefined,
        payment_options: currency === 'ZMW' ? "card,mobilemoneyzambia" : "card",
        customer: {
          email: email,
          name: name,
        },
        meta: {
          supabaseUserId: userId || '',
        },
        customizations: {
          title: "Kindline Care Donation",
          description: frequency === 'monthly' ? "Monthly subscription for Kindline Care" : "Payment for supporting orphans and widows",
          logo: window.location.origin + "/logo.png",
        },
        callback: function (data: FlutterwaveResponse) {
          console.log("Flutterwave payment completed callback for ID:", data.transaction_id);
          // Verify with backend
          fetch('/api/payments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              transaction_id: data.transaction_id,
              id: data.transaction_id, // Also pass as id just in case
              status: data.status
            })
          })
          .then(async verifyRes => {
            if (verifyRes.ok) {
              alert("Thank you for your donation!");
              window.location.reload();
            } else {
              const errorData = await verifyRes.json().catch(() => ({}));
              console.error("Flutterwave verification failed:", verifyRes.status, errorData);
              const message = errorData.error || errorData.message || "Please contact support.";
              alert(`Payment completed but verification failed: ${message}`);
            }
          })
          .catch(e => {
            console.error("Flutterwave verification error", e);
            alert("An error occurred during verification. Please contact support.");
          });
        },
        onclose: function() {
          console.log("Payment closed");
        }
      });
    } else {
        alert("Payment gateway is loading. Please try again in a moment.");
    }
  };

  return (
    <Card className="border-2 border-brand-blue/10 shadow-2xl overflow-hidden rounded-[2rem] dark:bg-gray-900 dark:border-gray-800">
      <div className="bg-brand-blue text-white p-10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <h2 className="text-3xl font-extrabold mb-2 relative z-10">Make an Impact</h2>
        <p className="text-white/90 font-medium relative z-10">Your support helps us provide sustainable care.</p>
      </div>
      <CardContent className="p-8 md:p-10">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="donorName" className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wide">Full Name</label>
              <input
                id="donorName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="block w-full rounded-xl border-2 border-gray-100 dark:border-gray-700 shadow-sm focus:border-brand-blue focus:ring-brand-blue p-4 text-gray-900 dark:text-white font-medium transition-colors bg-gray-50/50 dark:bg-gray-800/50"
              />
            </div>
            <div>
              <label htmlFor="donorEmail" className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wide">Email Address</label>
              <input
                id="donorEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="block w-full rounded-xl border-2 border-gray-100 dark:border-gray-700 shadow-sm focus:border-brand-blue focus:ring-brand-blue p-4 text-gray-900 dark:text-white font-medium transition-colors bg-gray-50/50 dark:bg-gray-800/50"
              />
            </div>
          </div>

          <div>
            <label htmlFor="donorPhone" className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wide">Phone Number (Required for Mobile Money)</label>
            <input
              id="donorPhone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0970000000"
              className="block w-full rounded-xl border-2 border-gray-100 dark:border-gray-700 shadow-sm focus:border-brand-blue focus:ring-brand-blue p-4 text-gray-900 dark:text-white font-medium transition-colors bg-gray-50/50 dark:bg-gray-800/50"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-wide">Donation Amount</label>
            <div className="flex gap-3 flex-wrap">
              {(currency === 'ZMW' ? ['500', '1000', '1500'] : ['25', '50', '80']).map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val)}
                  className={`px-6 py-3 rounded-xl border-2 font-bold transition-all ${amount === val ? 'bg-brand-blue text-white border-brand-blue shadow-lg scale-105' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-100 dark:border-gray-700 hover:border-brand-blue/30'}`}
                >
                  {currency} {val}
                </button>
              ))}
              <div className="relative flex-grow min-w-[120px]">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Other"
                  className="w-full rounded-xl border-2 border-gray-100 dark:border-gray-700 shadow-sm focus:border-brand-blue focus:ring-brand-blue p-3 text-gray-900 dark:text-white font-bold bg-gray-50/50 dark:bg-gray-800/50"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="currency" className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wide">Currency</label>
                <select
                id="currency"
                value={currency}
                onChange={(e) => {
                    const newCurrency = e.target.value;
                    setCurrency(newCurrency);
                    if (newCurrency === 'ZMW') {
                      setAmount('500');
                    } else {
                      setAmount('25');
                    }
                    if (newCurrency !== 'ZMW' && newCurrency !== 'USD') setMethod('flutterwave');
                }}
                className="block w-full rounded-xl border-2 border-gray-100 dark:border-gray-700 shadow-sm focus:border-brand-blue focus:ring-brand-blue p-4 text-gray-900 dark:text-white font-bold bg-gray-50/50 dark:bg-gray-800/50"
                >
                <option value="ZMW" className="dark:bg-gray-800">ZMW (Zambian Kwacha)</option>
                <option value="USD" className="dark:bg-gray-800">USD (US Dollar)</option>
                <option value="GBP" className="dark:bg-gray-800">GBP (British Pound)</option>
                <option value="CAD" className="dark:bg-gray-800">CAD (Canadian Dollar)</option>
                <option value="EUR" className="dark:bg-gray-800">EUR (Euro)</option>
                </select>
            </div>
            <div>
                <label htmlFor="paymentMethod" className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wide">Payment Gateway</label>
                <select
                id="paymentMethod"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                disabled={currency !== 'ZMW' && currency !== 'USD'}
                className="block w-full rounded-xl border-2 border-gray-100 dark:border-gray-700 shadow-sm focus:border-brand-blue focus:ring-brand-blue p-4 text-gray-900 dark:text-white font-bold bg-gray-50/50 dark:bg-gray-800/50 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                >
                <option value="flutterwave" className="dark:bg-gray-800">Flutterwave (Universal)</option>
                {(currency === 'ZMW' || currency === 'USD') && <option value="lenco" className="dark:bg-gray-800">Lenco Pay (Cards & MM)</option>}
                </select>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
            <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-wide">Donation Frequency</label>
            <div className="flex gap-8">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input type="radio" name="frequency" checked={frequency === 'one-time'} onChange={() => handleFrequencyChange('one-time')} className="w-5 h-5 text-brand-blue border-2 border-gray-300 dark:border-gray-600 focus:ring-brand-blue" />
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-blue transition-colors">One-time</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input type="radio" name="frequency" checked={frequency === 'monthly'} onChange={() => handleFrequencyChange('monthly')} className="w-5 h-5 text-brand-blue border-2 border-gray-300 dark:border-gray-600 focus:ring-brand-blue" />
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-blue transition-colors flex items-center gap-2">
                  Monthly
                  {!recurringDonationsEnabled && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-amber-200">
                      PRO
                    </span>
                  )}
                </span>
              </label>
            </div>
            {frequency === 'monthly' && (
                <p className="text-sm text-brand-purple mt-4 font-bold flex items-center gap-2">
                  <Heart className="h-4 w-4 fill-current" />
                  Monthly donations make the donor friends of Kindline.
                </p>
            )}
          </div>

          <Button
            onClick={method === 'flutterwave' ? handleFlutterwave : handleLenco}
            disabled={!email || !amount || !name}
            className="w-full bg-brand-orange hover:bg-brand-orange/90 h-16 text-xl font-extrabold rounded-xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Heart className="mr-2 h-6 w-6" /> {frequency === 'monthly' ? 'Subscribe' : 'Donate'} {currency} {amount}
          </Button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
            Secure payment powered by <span className="text-brand-blue font-bold">{method === 'flutterwave' ? 'Flutterwave' : 'Lenco'}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
