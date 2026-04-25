'use client';

import { registerVolunteer } from './actions';
import { Button } from '@/components/ui/Button';
import { SignInButton, SignUpButton, Show } from '@clerk/nextjs';

export default function VolunteerForm() {
  return (
    <div className="space-y-6">
      <Show when="signed-out">
        <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign in to Volunteer</h3>
          <p className="text-gray-600 mb-4">To track your application and access the volunteer dashboard, please create an account or sign in.</p>
          <div className="flex justify-center gap-4">
            <SignInButton mode="modal">
              <Button variant="outline">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="bg-blue-800 hover:bg-blue-900">Create Account</Button>
            </SignUpButton>
          </div>
        </div>
      </Show>

      <Show when="signed-in">
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
      </Show>
    </div>
  );
}
