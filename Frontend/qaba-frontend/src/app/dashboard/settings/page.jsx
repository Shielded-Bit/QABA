"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  
  // Redirect to profile by default with the correct path
  useEffect(() => {
    router.push('/dashboard/settings/profile');
  }, [router]);
  
  return (
    <div className="text-center text-gray-500 py-20">
      <p className="text-lg">Loading settings...</p>
    </div>
  );
}