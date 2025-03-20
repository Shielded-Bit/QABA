// /message/chat/page.jsx
'use client';

import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const router = useRouter();

 
  router.push('/message');

  return null;
}