'use client';

import { registerVolunteer } from './actions';
import { Button } from '@/components/ui/Button';

export default function VolunteerForm() {
  return (
    <form action={registerVolunteer} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input name="name" type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input name="email" type="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
        <input name="phone" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Skills / Expertise</label>
        <textarea name="skills" rows={2} placeholder="e.g. Teaching, Healthcare, Tailoring..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Why do you want to volunteer?</label>
        <textarea name="interests" rows={3} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"></textarea>
      </div>
      <Button type="submit" className="w-full bg-blue-800 hover:bg-blue-900">Submit Application</Button>
    </form>
  );
}
