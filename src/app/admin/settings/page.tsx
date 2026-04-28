export const dynamic = "force-dynamic";
import prisma from '@/lib/prisma';
import { updatePaymentSettings } from './actions';

export default async function AdminSettingsPage() {
  const settings = await prisma.paymentSettings.findFirst() || {
    flutterwaveSecret: '',
    flutterwavePublic: '',
    flutterwaveEncrypt: '',
    lencoSecret: '',
    lencoPublic: '',
    lencoBaseUrl: 'https://sandbox.lenco.co/access/v2/',
    flutterwavePlanZMW: '',
    flutterwavePlanUSD: '',
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Payment Settings</h1>

      <form action={updatePaymentSettings} className="space-y-8">
        {/* Flutterwave */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            Flutterwave Configuration
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Public Key</label>
              <input
                name="flutterwavePublic"
                type="text"
                defaultValue={settings.flutterwavePublic || ''}
                placeholder={process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || ""}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
              {process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY && <p className="text-xs text-green-600 mt-1">✓ Public key is set in environment</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Secret Key</label>
              <input
                name="flutterwaveSecret"
                type="password"
                defaultValue={settings.flutterwaveSecret || ''}
                placeholder={process.env.FLUTTERWAVE_SECRET_KEY ? "********" : ""}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
              {process.env.FLUTTERWAVE_SECRET_KEY && <p className="text-xs text-green-600 mt-1">✓ Secret key is set in environment</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Encryption Key</label>
              <input
                name="flutterwaveEncrypt"
                type="text"
                defaultValue={settings.flutterwaveEncrypt || ''}
                placeholder={process.env.FLUTTERWAVE_ENCRYPTION_KEY ? "********" : ""}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
              {process.env.FLUTTERWAVE_ENCRYPTION_KEY && <p className="text-xs text-green-600 mt-1">✓ Encryption key is set in environment</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Monthly Plan ID (ZMW)</label>
                <input
                  name="flutterwavePlanZMW"
                  type="text"
                  defaultValue={settings.flutterwavePlanZMW || ''}
                  placeholder="e.g. 78508"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Monthly Plan ID (USD/GBP/CAD/EUR)</label>
                <input
                  name="flutterwavePlanUSD"
                  type="text"
                  defaultValue={settings.flutterwavePlanUSD || ''}
                  placeholder="e.g. 78509"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lenco */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            Lenco Configuration
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Public Key</label>
              <input name="lencoPublic" type="text" defaultValue={settings.lencoPublic || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Secret Key</label>
              <input name="lencoSecret" type="password" defaultValue={settings.lencoSecret || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Base URL</label>
              <input name="lencoBaseUrl" type="text" defaultValue={settings.lencoBaseUrl || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-bold">
            Update Settings
          </button>
        </div>
      </form>
    </div>
  );
}
