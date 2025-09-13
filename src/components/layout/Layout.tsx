import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgb(var(--color-card))',
            color: 'rgb(var(--color-text))',
            border: '1px solid rgb(var(--color-border))',
          },
          success: {
            iconTheme: {
              primary: 'rgb(var(--color-primary))',
              secondary: 'rgb(var(--color-card))',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'rgb(var(--color-card))',
            },
          },
        }}
      />
    </div>
  );
};

export default Layout;