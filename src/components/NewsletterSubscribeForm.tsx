'use client';

import { useState } from "react";
import { Button } from "./ui/Button";
import { subscribe } from "@/app/admin/newsletter/actions";

export function NewsletterSubscribeForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(formData: FormData) {
    setStatus('loading');
    try {
      await subscribe(formData);
      setStatus('success');
    } catch (error) {
      console.error('Subscription error:', error);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 text-green-800 p-4 rounded-md text-center max-w-md mx-auto">
        <p className="font-bold">Thank you for subscribing!</p>
        <p className="text-sm">You&apos;ll receive our latest updates soon.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto w-full">
      <form
        className="flex flex-col sm:flex-row gap-4"
        action={handleSubmit}
      >
        <input
          name="email"
          aria-label="Email address for newsletter"
          type="email"
          placeholder="Your email address"
          className="flex-grow px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          required
          disabled={status === 'loading'}
        />
        <Button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
      {status === 'error' && (
        <p className="text-red-600 text-sm mt-2 text-center">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
