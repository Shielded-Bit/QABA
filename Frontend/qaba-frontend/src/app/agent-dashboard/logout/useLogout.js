// src/components/logout/useLogout.js
import { useRouter } from 'next/navigation';

const useLogout = () => {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('authToken'); // Clear token
    router.push('/'); // Redirect to home page
  };

  return { logout };
};

export default useLogout;