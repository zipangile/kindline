'use client';

import { useEffect, useState } from 'react';
import { registerVolunteer } from './actions';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export default function VolunteerForm() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  return (
    <div className="space-y-6">
      {!user ? (
        <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign in to Volunteer</h3>
          <p className="text-gray-600 mb-4">To track your application and access the volunteer dashboard, please create an account or sign in.</p>
          <div className="flex justify-center gap-4">
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/signup?role=volunteer">
              <Button className="bg-blue-800 hover:bg-blue-900">Create Account</Button>
            </Link>
          </div>
        </div>
      ) : (
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input name="location" type="text" placeholder="City, Country" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Availability</label>
          <select name="availability" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
            <option value="part-time">Part-time</option>
            <option value="full-time">Full-time</option>
            <option value="weekends">Weekends Only</option>
            <option value="remote">Remote / Occasional</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Years of Experience / Expertise level</label>
        <input name="experience" type="text" placeholder="e.g. 5 years in teaching, Expert in Excel..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Skills / Expertise</label>
        <textarea name="skills" rows={2} placeholder="e.g. Teaching, Healthcare, Tailoring, Social Media Marketing..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Why do you want to volunteer? / Relevant Interests</label>
        <textarea name="interests" rows={3} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"></textarea>
      </div>
          <Button type="submit" className="w-full bg-blue-800 hover:bg-blue-900">Submit Application</Button>
        </form>
      )}
    </div>
  );
}
