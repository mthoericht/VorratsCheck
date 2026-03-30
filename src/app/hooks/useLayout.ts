import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export function useLayout() 
{
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleLogout = () => 
  {
    logout();
  };

  return {
    user,
    isNavOpen,
    setIsNavOpen,
    handleLogout,
  };
}
