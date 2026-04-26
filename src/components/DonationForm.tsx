'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Heart } from "lucide-react";
import { useAuth } from '@clerk/nextjs';

interface LencoPayResponse {
  status: string;
  reference: string;
  [key: string]: unknown;
}

interface FlutterwaveResponse {
  status: string;
  tx_ref: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    LencoPay: {
      setup: (options: unknown) => { openIframe: () => void };
    };
    FlutterwaveCheckout: (options: unknown) => void;
  }
}

export default function DonationForm({ settings }: { settings: { lencoPublic?: string; flutterwavePublic?: string; flutterwavePlanZMW?: string; flutterwavePlanUSD?: string } }) {
  const { userId } = useAuth();
  const [amount, setAmount] = useState('50');
  const [currency, setCurrency] = useState('ZMW');
  const [method, setMethod] = useState('flutterwave');
  const [frequency, setFrequency] = useState('one-time');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleLenco = () => {
    const publicKey = settings?.lencoPublic;

    if (!publicKey) {
        alert("Lenco gateway is not configured properly.");
        return;
    }

    if (typeof window.LencoPay !== 'undefined') {
      const handler = window.LencoPay.setup({
        key: publicKey,
        email: email,
        amount: parseFloat(amount) * 100, // Lenco expects amount in kobo/cents
        currency: currency,
        reference: "KCF-L-" + Date.now(),
        callback: async function(response: LencoPayResponse) {
          console.log("Lenco payment success", response);
          // Verify with backend
          try {
            const verifyRes = await fetch('/api/payments/lenco', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                reference: response.reference,
                clerkUserId: userId
              })
            });
            if (verifyRes.ok) {
              alert("Thank you for your donation!");
              window.location.reload();
            } else {
              alert("Payment completed but verification failed. Please contact support.");
            }
          } catch (e) {
            console.error("Lenco verification error", e);
            alert("An error occurred during verification. Please contact support.");
          }
        },
        onClose: function() {
          console.log("Lenco window closed");
        }
      });
      handler.openIframe();
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
        payment_plan: planId,
        payment_options: "card, mobilemoneyzambia, ussd",
        customer: {
          email: email,
          name: name,
        },
        meta: {
          clerkUserId: userId || '',
        },
        customizations: {
          title: "Kindline Care Donation",
          description: frequency === 'monthly' ? "Monthly subscription for Kindline Care" : "Payment for supporting orphans and widows",
          logo: "https://kindlinecare.org/logo.png",
        },
        callback: async function (data: FlutterwaveResponse) {
          console.log("Payment completed!", data);
          // Verify with backend
          try {
            const verifyRes = await fetch('/api/payments', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                transaction_id: data.transaction_id,
                status: data.status
              })
            });
            if (verifyRes.ok) {
              alert("Thank you for your donation!");
              window.location.reload();
            } else {
              alert("Payment completed but verification failed. Please contact support.");
            }
          } catch (e) {
            console.error("Flutterwave verification error", e);
            alert("An error occurred during verification. Please contact support.");
          }
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
    <Card className="border-2 border-brand-blue/10 shadow-2xl overflow-hidden rounded-[2rem]">
      <div className="bg-brand-blue text-white p-10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <h2 className="text-3xl font-extrabold mb-2 relative z-10">Make an Impact</h2>
        <p className="text-white/90 font-medium relative z-10">Your support helps us provide sustainable care.</p>
      </div>
      <CardContent className="p-8 md:p-10">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="block w-full rounded-xl border-2 border-gray-100 shadow-sm focus:border-brand-blue focus:ring-brand-blue p-4 text-gray-900 font-medium transition-colors bg-gray-50/50"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="block w-full rounded-xl border-2 border-gray-100 shadow-sm focus:border-brand-blue focus:ring-brand-blue p-4 text-gray-900 font-medium transition-colors bg-gray-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Donation Amount</label>
            <div className="flex gap-3 flex-wrap">
              {['20', '50', '100', '200', '500'].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val)}
                  className={`px-6 py-3 rounded-xl border-2 font-bold transition-all ${amount === val ? 'bg-brand-blue text-white border-brand-blue shadow-lg scale-105' : 'bg-white text-gray-700 border-gray-100 hover:border-brand-blue/30'}`}
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
                  className="w-full rounded-xl border-2 border-gray-100 shadow-sm focus:border-brand-blue focus:ring-brand-blue p-3 text-gray-900 font-bold bg-gray-50/50"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Currency</label>
                <select
                value={currency}
                onChange={(e) => {
                    const newCurrency = e.target.value;
                    setCurrency(newCurrency);
                    if (newCurrency !== 'ZMW') setMethod('flutterwave');
                }}
                className="block w-full rounded-xl border-2 border-gray-100 shadow-sm focus:border-brand-blue focus:ring-brand-blue p-4 text-gray-900 font-bold bg-gray-50/50"
                >
                <option value="ZMW">ZMW (Zambian Kwacha)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="GBP">GBP (British Pound)</option>
                <option value="CAD">CAD (Canadian Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Payment Gateway</label>
                <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                disabled={currency !== 'ZMW'}
                className="block w-full rounded-xl border-2 border-gray-100 shadow-sm focus:border-brand-blue focus:ring-brand-blue p-4 text-gray-900 font-bold bg-gray-50/50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                <option value="flutterwave">Flutterwave (Universal)</option>
                {currency === 'ZMW' && <option value="lenco">Lenco Pay (Local)</option>}
                </select>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <label className="block text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Donation Frequency</label>
            <div className="flex gap-8">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input type="radio" name="frequency" checked={frequency === 'one-time'} onChange={() => setFrequency('one-time')} className="w-5 h-5 text-brand-blue border-2 border-gray-300 focus:ring-brand-blue" />
                </div>
                <span className="text-lg font-bold text-gray-900 group-hover:text-brand-blue transition-colors">One-time</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input type="radio" name="frequency" checked={frequency === 'monthly'} onChange={() => {
                      setFrequency('monthly');
                      setMethod('flutterwave');
                  }} className="w-5 h-5 text-brand-blue border-2 border-gray-300 focus:ring-brand-blue" />
                </div>
                <span className="text-lg font-bold text-gray-900 group-hover:text-brand-blue transition-colors">Monthly</span>
              </label>
            </div>
            {frequency === 'monthly' && (
                <p className="text-sm text-brand-purple mt-4 font-bold flex items-center gap-2">
                  <Heart className="h-4 w-4 fill-current" />
                  Monthly donations are processed via Flutterwave and support Kindline Friends.
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

          <p className="text-center text-sm text-gray-500 font-medium">
            Secure payment powered by <span className="text-brand-blue font-bold">{method === 'flutterwave' ? 'Flutterwave' : 'Lenco'}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
