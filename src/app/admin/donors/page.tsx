export const dynamic = "force-dynamic";
import prisma from '@/lib/prisma';
import { Donation } from '@prisma/client';
import { verifyDonation, deleteDonation } from './actions';

export default async function AdminDonorsPage() {
  const donations = await prisma.donation.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Friends of Kindline (Donors)</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {donations.map((d: Donation) => (
              <tr key={d.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{d.donorName}</div>
                  <div className="text-sm text-gray-500">{d.donorEmail}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-gray-900">{d.currency} {d.amount.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 capitalize">{d.gateway}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    d.type === 'monthly' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {d.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    d.status === 'successful' ? 'bg-green-100 text-green-800' :
                    d.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {d.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(d.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                  {d.status !== 'successful' && (
                    <form action={verifyDonation.bind(null, d.id)} className="inline">
                      <button type="submit" className="text-blue-600 hover:text-blue-900">Verify</button>
                    </form>
                  )}
                  <form action={deleteDonation.bind(null, d.id)} className="inline">
                    <button type="submit" className="text-red-600 hover:text-red-900">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {donations.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500 italic">No donations recorded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
