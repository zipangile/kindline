import { Resend } from 'resend';
import prisma from '@/lib/prisma';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

interface DonationData {
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  transactionId: string;
  gateway: string;
  supabaseUserId?: string | null;
}

export async function sendDonationEmails(donation: DonationData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY is not set. Skipping emails.');
    return;
  }

  try {
    const settings = await prisma.paymentSettings.findFirst();
    const adminEmails = settings?.notificationEmail || process.env.ADMIN_EMAIL || 'sobhuxa@gmail.com';

    // 1. Confirmation Email to Donor
    await resend.emails.send({
      from: 'Kindline Care <impact@kindlinecare.org>',
      to: donation.donorEmail,
      subject: 'Thank you for your life-changing gift',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #8B438E;">Thank you, ${donation.donorName || 'Friend'}!</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Your donation of <strong>${donation.currency} ${donation.amount}</strong> has been received and is already being put to work.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Because of your generosity, we can continue to provide education for orphans and economic tools for widows in Zambia.
            In the coming weeks, we'll share stories of the specific lives you are helping to transform.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            With gratitude,<br>
            <strong>The Kindline Care Team</strong>
          </p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">
            Transaction ID: ${donation.transactionId} | Gateway: ${donation.gateway}
          </p>
        </div>
      `
    });

    // 2. Invitation to Friends Dashboard (if they have a user ID or to encourage them to join)
    await resend.emails.send({
      from: 'Kindline Care <friends@kindlinecare.org>',
      to: donation.donorEmail,
      subject: 'Access your Friends of Kindline Dashboard',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #00A651;">Your Impact, At Your Fingertips</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Did you know you can track your impact through our Friends Dashboard?
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            ${donation.supabaseUserId
              ? 'Log in to see your donation history and exclusive updates from the field.'
              : 'Create an account using this email to see your donation history and exclusive updates from the field.'}
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://kindlinecare.org'}/dashboard"
               style="background-color: #8B438E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
               Go to Dashboard
            </a>
          </div>
          <p style="font-size: 14px; color: #666;">
            The Friends of Kindline community is growing, and we are honored to have you with us.
          </p>
        </div>
      `
    });

    // 3. Notification to Admins
    const adminEmailList = adminEmails.split(',').map(e => e.trim());
    await resend.emails.send({
      from: 'Kindline System <system@kindlinecare.org>',
      to: adminEmailList,
      subject: `New Donation: ${donation.currency} ${donation.amount} from ${donation.donorName}`,
      html: `
        <div style="font-family: sans-serif; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #333;">New Transaction Notification</h2>
          <p><strong>Donor:</strong> ${donation.donorName} (${donation.donorEmail})</p>
          <p><strong>Amount:</strong> ${donation.currency} ${donation.amount}</p>
          <p><strong>Gateway:</strong> ${donation.gateway}</p>
          <p><strong>Transaction ID:</strong> ${donation.transactionId}</p>
          <p><strong>Status:</strong> Successful</p>
          <div style="margin-top: 20px;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://kindlinecare.org'}/admin/friends"
               style="color: #8B438E; font-weight: bold;">
               View in Admin Dashboard
            </a>
          </div>
        </div>
      `
    });

    console.log(`[Email] All donation emails sent for transaction ${donation.transactionId}`);
  } catch (error) {
    console.error('[Email] Error sending donation emails:', error);
  }
}
