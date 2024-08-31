import React from 'react';
import AdminNaviBar from './Components/AdminNavigationBar';
import ToggleSlideBar from './Components/ToggleSlideBar';
import useSidebar from './Components/useSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const AdminPage = () => {
  const { isSidebarVisible, toggleSidebar, sidebarRef } = useSidebar();

  // SidebarWithOverlay component
  const SidebarWithOverlay = () => (
    <div className="flex">
      <ToggleSlideBar ref={sidebarRef} isVisible={isSidebarVisible} />
      {isSidebarVisible && (
        <div
          className="fixed inset-0 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );

  // MainContent component
  const MainContent = () => (
    <main className="flex-1 p-6 mt-16">
      <div className="bg-white p-8 rounded shadow-md max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Welcome to Admin</h1>
        <p className="text-center text-gray-700">
          This is the admin panel where you can manage various aspects of the application.
        </p>
      </div>
    </main>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNaviBar selectedPage="Admin Panel" />
      <div className="p-5 custom1-md:pl-[4rem]">
        <button
          className="text-gray-800 text-2xl focus:outline-none "
          onClick={toggleSidebar}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      <SidebarWithOverlay />

      <MainContent />
    </div>
  );
};

export default AdminPage;
