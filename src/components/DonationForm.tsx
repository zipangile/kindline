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
    <Card className="border-2 border-blue-100 shadow-xl overflow-hidden">
      <div className="bg-blue-600 text-white p-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Make an Impact</h2>
        <p className="opacity-90">Your support helps us provide sustainable care.</p>
      </div>
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Donation Amount</label>
            <div className="flex gap-2 flex-wrap">
              {['20', '50', '100', '200', '500'].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val)}
                  className={`px-4 py-2 rounded-lg border ${amount === val ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'}`}
                >
                  {currency} {val}
                </button>
              ))}
              <div className="relative flex-grow">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Other"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                value={currency}
                onChange={(e) => {
                    const newCurrency = e.target.value;
                    setCurrency(newCurrency);
                    if (newCurrency !== 'ZMW') setMethod('flutterwave');
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                >
                <option value="ZMW">ZMW (Zambian Kwacha)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="GBP">GBP (British Pound)</option>
                <option value="CAD">CAD (Canadian Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Gateway</label>
                <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                disabled={currency !== 'ZMW'}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border disabled:bg-gray-50"
                >
                <option value="flutterwave">Flutterwave (Universal)</option>
                {currency === 'ZMW' && <option value="lenco">Lenco Pay (Local)</option>}
                </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="frequency" checked={frequency === 'one-time'} onChange={() => setFrequency('one-time')} className="text-blue-600" />
                <span>One-time</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="frequency" checked={frequency === 'monthly'} onChange={() => {
                    setFrequency('monthly');
                    setMethod('flutterwave');
                }} className="text-blue-600" />
                <span>Monthly</span>
              </label>
            </div>
            {frequency === 'monthly' && (
                <p className="text-xs text-blue-600 mt-2 font-medium">Monthly donations are processed via Flutterwave and support Kindline Friends.</p>
            )}
          </div>

          <Button
            onClick={method === 'flutterwave' ? handleFlutterwave : handleLenco}
            disabled={!email || !amount || !name}
            className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-bold"
          >
            <Heart className="mr-2 h-5 w-5" /> {frequency === 'monthly' ? 'Subscribe' : 'Donate'} {currency} {amount}
          </Button>

          <p className="text-center text-xs text-gray-500 italic">
            Payments are secured by {method === 'flutterwave' ? 'Flutterwave' : 'Lenco'}. You can pay via Card, Mobile Money, or Bank Transfer.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
