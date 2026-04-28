'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL || 'sobhuxa@gmail.com';
  const isAdmin = user?.app_metadata?.role === 'admin' || user?.email === adminEmail;
  if (!isAdmin) {
    redirect('/login');
  }
  return user;
}
