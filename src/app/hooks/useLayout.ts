import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export function useLayout() 
{
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleLogout = () => 
  {
    setIsUserMenuOpen(false);
    logout();
  };

  return {
    user,
    isUserMenuOpen,
    setIsUserMenuOpen,
    isNavOpen,
    setIsNavOpen,
    handleLogout,
  };
}
