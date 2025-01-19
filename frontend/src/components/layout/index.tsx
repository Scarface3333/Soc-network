import React, { useEffect } from 'react';
import { Header } from '../header';
import { Container } from '../container';
import { NavBar } from '../nav-bar';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectisAuthentificated } from '../../features/user/userSlice';

export const Layout = () => {
  const isAuthenticated = useSelector(selectisAuthentificated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-row min-h-screen">
      <NavBar />
      <div className="flex flex-col flex-grow">
        <Header />
        <Container>
          <div className="pb-20 p-4 flex-grow">
            <Outlet />
          </div>
        </Container>
      </div>
    </div>
  );
};
