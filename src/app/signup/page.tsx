import { signup } from '../login/actions'
import Link from 'next/link'

export default async function SignupPage({
  params,
  searchParams,
}: {
  params: Promise<Record<string, string | string[] | undefined>>;
  searchParams: Promise<{ error?: string; role?: string }>
}) {
  await params;
  const p = await searchParams;
  const isVolunteer = p.role === 'volunteer';
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-6 sm:p-10 bg-white rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join Kindline Care Foundation today
          </p>
          {p.error && (
            <div className="mt-2 text-center text-sm text-red-600">
              {p.error}
            </div>
          )}
        </div>
        <form className="mt-8 space-y-6">
          <input type="hidden" name="role" value={p.role || ''} />
          <div className="rounded-md shadow-sm space-y-4">
            {isVolunteer && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input id="name" name="name" type="text" required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" placeholder="Full Name" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
                  <input id="phone" name="phone" type="text" className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" placeholder="Phone" />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                  <input id="location" name="location" type="text" placeholder="City, Country" className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="availability" className="block text-sm font-medium text-gray-700">Availability</label>
                  <select id="availability" name="availability" className="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm">
                    <option value="part-time">Part-time</option>
                    <option value="full-time">Full-time</option>
                    <option value="weekends">Weekends Only</option>
                    <option value="remote">Remote / Occasional</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Skills / Expertise</label>
                  <textarea id="skills" name="skills" rows={2} placeholder="e.g. Teaching, Healthcare..." className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"></textarea>
                </div>
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Experience</label>
                  <input id="experience" name="experience" type="text" placeholder="Years or relevant experience" className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="interests" className="block text-sm font-medium text-gray-700">Why do you want to volunteer?</label>
                  <textarea id="interests" name="interests" rows={2} required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"></textarea>
                </div>
              </>
            )}
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">Email address</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" placeholder="Email address" />
            </div>
            <div>
              <label htmlFor="password" title="Password must be at least 6 characters" className="block text-sm font-medium text-gray-700">Password</label>
              <input id="password" name="password" type="password" autoComplete="new-password" required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" placeholder="Password" />
            </div>
          </div>

          <div>
            <button formAction={signup} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-brand-orange focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
              Sign up
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-brand-blue hover:text-brand-purple hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
