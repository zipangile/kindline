'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Heart } from 'lucide-react';

interface PayButtonClientProps {
  amount: number;
  settings: {
    lencoPublic: string;
    lencoBaseUrl: string;
    lencoName: string;
    flutterwavePublic: string;
  };
  email: string;
  name: string;
  phone: string;
  userId: string;
}

export default function PayButtonClient({
  amount,
  settings,
  email,
  name,
  phone,
  userId
}: PayButtonClientProps) {
  const [method, setMethod] = useState<'flutterwave' | 'lenco'>('flutterwave');

  const handleFlutterwave = () => {
    if (!settings.flutterwavePublic) {
      alert("Flutterwave is not configured.");
      return;
    }

    if (typeof window.FlutterwaveCheckout === 'function') {
      window.FlutterwaveCheckout({
        public_key: settings.flutterwavePublic,
        tx_ref: "KCF-V-" + Date.now(),
        amount: amount,
        currency: "ZMW",
        payment_options: "card,mobilemoneyzambia",
        customer: {
          email: email,
          name: name,
        },
        meta: {
          supabaseUserId: userId,
          type: 'volunteer-signup',
        },
        customizations: {
          title: "Volunteer Registration Fee",
          description: "One-time volunteer signup application fee",
          logo: window.location.origin + "/logo.png",
        },
        callback: function (data: unknown) {
          console.log("Flutterwave payment completed:", data);
          alert("Application fee payment successful! Thank you.");
          window.location.href = '/dashboard/volunteer';
        },
        onclose: function() {
          console.log("Payment closed");
        }
      });
    } else {
      alert("Payment script loading. Please try again.");
    }
  };

  const handleLenco = () => {
    if (!settings.lencoPublic) {
      alert("Lenco Pay is not configured.");
      return;
    }

    if (typeof window.LencoPay !== 'undefined' && typeof window.LencoPay.getPaid === 'function') {
      const reference = `KCF-V-L-${userId}-${Date.now()}`;
      window.LencoPay.getPaid({
        key: settings.lencoPublic,
        email: email,
        amount: amount,
        currency: "ZMW",
        reference: reference,
        label: settings.lencoName,
        channels: ["card", "mobile-money"],
        customer: {
          firstName: name.split(' ')[0] || '',
          lastName: name.split(' ').slice(1).join(' ') || '',
          phone: phone,
        },
        onSuccess: function(response: unknown) {
          console.log("Lenco successful payment:", response);
          alert("Application fee payment successful! Thank you.");
          window.location.href = '/dashboard/volunteer';
        },
        onClose: function() {
          console.log("Payment window closed");
        }
      });
    } else {
      alert("Payment gateway is loading. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-4 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
        <label className="flex items-center gap-2 cursor-pointer font-semibold text-sm">
          <input
            type="radio"
            checked={method === 'flutterwave'}
            onChange={() => setMethod('flutterwave')}
            className="text-brand-blue"
          />
          Flutterwave
        </label>
        <label className="flex items-center gap-2 cursor-pointer font-semibold text-sm">
          <input
            type="radio"
            checked={method === 'lenco'}
            onChange={() => setMethod('lenco')}
            className="text-brand-blue"
          />
          Lenco Pay
        </label>
      </div>

      <Button
        onClick={method === 'flutterwave' ? handleFlutterwave : handleLenco}
        className="w-full bg-brand-orange hover:bg-brand-orange/95 text-white font-extrabold text-lg h-14 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
      >
        <Heart className="fill-current" size={18} /> Pay ZMW {amount}
      </Button>
    </div>
  );
}
