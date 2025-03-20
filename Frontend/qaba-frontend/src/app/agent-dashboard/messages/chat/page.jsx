'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/message');
  }, [router]); // Ensures it runs only after the component mounts

  return null;
}
