import React, { useState, useEffect } from 'react';
import { NavButton } from '../nav-button';
import { useSelector } from 'react-redux';
import { selectCurrent } from '../../features/user/userSlice';
import { BiChat, BiSearch, BiUser } from 'react-icons/bi';

export const NavBar = () => {
  const currentUser = useSelector(selectCurrent);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleResize = () => setIsMobile(mediaQuery.matches);

    handleResize(); // Установить начальное состояние
    mediaQuery.addEventListener('change', handleResize);

    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  return (
    <nav
      className={`${isMobile
        ? 'fixed bottom-0 left-0 w-full z-50 flex justify-around items-center p-4 bg-background'
        : 'flex flex-col h-screen w-64 border-r justify-center items-start pl-8 gap-6 bg-background'
        }`}
    >
      {currentUser ? (
        <NavButton href={`/Search/UserProfilePage/${currentUser.id}`}>
          <BiUser size={24} />
        </NavButton>
      ) : (
        <li className="text-gray-500">Пользователь не авторизован</li>
      )}
      <NavButton href="Search">
        <BiSearch size={24} />
      </NavButton>
      <NavButton href="/messages/:senderId/:recipientId">
        <BiChat size={24} />
      </NavButton>
    </nav>
  );
};

