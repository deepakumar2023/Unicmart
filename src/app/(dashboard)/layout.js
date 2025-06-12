'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from './layout/AppHeader';
import AppSidebar from './layout/AppSidebar';
import { useSidebar } from '../components/context/SidebarContext';
import Backdrop from './layout/Backdrop';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(null);
 const { isExpanded, isHovered, isMobileOpen,toggleMobileSidebar } = useSidebar();

 const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";


  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsAuth(isLoggedIn);
    if (!isLoggedIn) router.push('/login');
  }, []);

  if (isAuth === false) return null;
  if (isAuth === null) return <div className="p-6">Checking login...</div>;

  return (
    <div  className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}>
      {/* Sidebar (desktop) */}
      <div className="hidden md:block">
        {/* <Backdrop/> */}
        <AppSidebar />
      </div>

      {/* Sidebar (mobile overlay) */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50  bg-opacity-50 md:hidden"
          onClick={toggleMobileSidebar}
        >
          <div
            className="absolute left-0 top-0 bg-white w-64 h-full"
            // onClick={(e) => e.stopPropagation()}
          >
            <AppSidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        <AppHeader />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
