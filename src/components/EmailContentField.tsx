'use client';

import { useState } from 'react';
import { formatEmailContent } from '@/lib/email-template';

export default function EmailContentField() {
  const [content, setContent] = useState('');
  return <div className="space-y-3">
    <label htmlFor="email-content" className="block text-sm font-medium">Message</label>
    <p id="email-content-help" className="text-sm text-gray-600">Use Enter for a line break and a blank line between paragraphs. Basic headings, lists, bold and safe links are supported; scripts, images and custom styles are not.</p>
    <textarea id="email-content" name="content" required maxLength={20000} aria-describedby="email-content-help" value={content} onChange={e => setContent(e.target.value)} className="h-48 w-full rounded border p-3" placeholder={'Hello friends,\n\nHere is our latest update.\nThank you for your support.'} />
    <details><summary className="cursor-pointer text-blue-700">Preview message formatting (does not send)</summary>
      <div className="mt-3 break-words rounded border bg-white p-4 text-gray-800" dangerouslySetInnerHTML={{ __html: content.trim() ? formatEmailContent(content) : '<p>Your message preview will appear here.</p>' }} />
    </details>
  </div>;
}
