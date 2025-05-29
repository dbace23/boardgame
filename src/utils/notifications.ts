import { supabase } from '../lib/supabase';

export async function subscribeToNotifications() {
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.VITE_VAPID_PUBLIC_KEY
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: user.id,
        subscription: JSON.stringify(subscription)
      });

    return subscription;
  } catch (error) {
    console.error('Error subscribing to notifications:', error);
    throw error;
  }
}

export async function unsubscribeFromNotifications() {
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return;

  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;

  await subscription.unsubscribe();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('push_subscriptions')
    .delete()
    .match({ user_id: user.id });
}