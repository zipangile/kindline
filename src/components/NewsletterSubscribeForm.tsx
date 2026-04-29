'use client';

import { Button } from "./ui/Button";

export function NewsletterSubscribeForm() {
  return (
    <form
      className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
      onSubmit={(e) => {
        e.preventDefault();
        alert('Thank you for subscribing! (Feature coming soon)');
      }}
    >
      <input
        type="email"
        placeholder="Your email address"
        className="flex-grow px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
        required
      />
      <Button type="submit">Subscribe</Button>
    </form>
  );
}
