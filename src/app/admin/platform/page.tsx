export const dynamic = "force-dynamic";

import prisma from '@/lib/prisma';
import { requireSuperadmin } from '@/lib/auth-utils';
import { getOrganization, FEATURES } from '@/lib/features';
import { updateOrganizationSettings } from './actions';
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function PlatformAdminPage() {
  await requireSuperadmin();

  const org = await getOrganization();
  const auditLogs = await prisma.adminAuditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 30,
  });

  // Safe parsing of feature overrides
  let overrides: Record<string, boolean> = {};
  if (org.featureOverrides) {
    if (typeof org.featureOverrides === 'string') {
      try {
        overrides = JSON.parse(org.featureOverrides);
      } catch {
        overrides = {};
      }
    } else {
      overrides = org.featureOverrides as Record<string, boolean>;
    }
  }

  const featureKeys = Object.keys(FEATURES) as Array<keyof typeof FEATURES>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Administration</h1>
        <p className="text-gray-500 mt-1">Manage global subscription tier, limits, fee structures, and feature flags.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <form action={updateOrganizationSettings}>
            <Card className="border border-gray-200 shadow-sm rounded-2xl bg-white overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-900">Organization Settings & Tier Configuration</h2>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="tier" className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Subscription Tier</label>
                    <select
                      id="tier"
                      name="tier"
                      defaultValue={org.tier}
                      className="block w-full rounded-xl border border-gray-200 bg-white p-3.5 text-gray-900 font-medium focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                    >
                      <option value="STARTER">Starter Tier</option>
                      <option value="GROWTH">Growth Tier</option>
                      <option value="PRO">Pro Tier</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="donationFeePercent" className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Donation Fee Percentage (%)</label>
                    <input
                      id="donationFeePercent"
                      name="donationFeePercent"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      defaultValue={parseFloat(org.donationFeePercent.toString())}
                      className="block w-full rounded-xl border border-gray-200 bg-white p-3 text-gray-900 font-medium focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                    />
                  </div>

                  <div>
                    <label htmlFor="volunteerCap" className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Volunteer Capacity (Max Active/Approved)</label>
                    <input
                      id="volunteerCap"
                      name="volunteerCap"
                      type="text"
                      defaultValue={org.volunteerCap === null ? 'null' : org.volunteerCap}
                      placeholder="e.g. 15, 50, or null for unlimited"
                      className="block w-full rounded-xl border border-gray-200 bg-white p-3 text-gray-900 font-medium focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                    />
                    <p className="text-xs text-gray-400 mt-1">Use &quot;null&quot; or leave empty for unlimited capacity.</p>
                  </div>

                  <div>
                    <label htmlFor="newsletterSubCap" className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Newsletter Subscriber Cap</label>
                    <input
                      id="newsletterSubCap"
                      name="newsletterSubCap"
                      type="text"
                      defaultValue={org.newsletterSubCap === null ? 'null' : org.newsletterSubCap}
                      placeholder="e.g. 500 or null for unlimited"
                      className="block w-full rounded-xl border border-gray-200 bg-white p-3 text-gray-900 font-medium focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                    />
                    <p className="text-xs text-gray-400 mt-1">Use &quot;null&quot; or leave empty for unlimited subscribers.</p>
                  </div>

                  <div>
                    <label htmlFor="volunteerSignupFee" className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Volunteer Signup One-Time Fee</label>
                    <input
                      id="volunteerSignupFee"
                      name="volunteerSignupFee"
                      type="number"
                      step="1"
                      min="0"
                      defaultValue={org.volunteerSignupFee}
                      placeholder="e.g. 50 (set to 0 to disable)"
                      className="block w-full rounded-xl border border-gray-200 bg-white p-3 text-gray-900 font-medium focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                    />
                    <p className="text-xs text-gray-400 mt-1">Enter fee amount. Volunteers will be directed to make a one-time payment if greater than 0.</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-md font-bold text-gray-900 mb-4">Manual Feature Overrides</h3>
                  <p className="text-sm text-gray-500 mb-6">Manually force enable or disable feature flags regardless of organization tier.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {featureKeys.map((key) => {
                      const value = overrides[key];
                      return (
                        <div key={key} className="flex items-center justify-between p-3.5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                          <div className="space-y-0.5">
                            <span className="text-sm font-semibold text-gray-900">{key}</span>
                            <div className="text-xs text-gray-400">
                              Default Tiers: {FEATURES[key].join(', ')}
                            </div>
                          </div>
                          <div>
                            <select
                              name={`override_${key}`}
                              defaultValue={value === undefined ? 'default' : (value ? 'true' : 'false')}
                              className="rounded-lg border border-gray-200 p-2 text-xs font-semibold focus:border-brand-blue bg-white"
                            >
                              <option value="default">Default Tier Behavior</option>
                              <option value="true">Force Unlock (ON)</option>
                              <option value="false">Force Lock (OFF)</option>
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/95 font-bold rounded-xl px-8 h-12 shadow-sm text-white">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        <div>
          <Card className="border border-gray-200 shadow-sm rounded-2xl bg-white overflow-hidden sticky top-8">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Platform Change Logs</h2>
            </div>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {auditLogs.length > 0 ? (
                  auditLogs.map((log) => (
                    <div key={log.id} className="p-4 space-y-1 text-sm">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span className="font-semibold text-brand-blue">{log.actorId}</span>
                        <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-800 font-medium">
                        Modified field <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-xs text-gray-600">{log.field}</span>
                      </p>
                      <div className="text-xs text-gray-500 space-y-0.5 font-medium">
                        <div>Old: <span className="font-mono text-red-600 break-all">{log.oldValue || 'none'}</span></div>
                        <div>New: <span className="font-mono text-green-600 break-all">{log.newValue || 'none'}</span></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-6 text-center text-sm text-gray-400">No logs captured yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
