import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './Layout.css';

const Layout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <div className="main-layout">
            <Sidebar collapsed={sidebarCollapsed} />
            <div className={`content-area ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar toggleSidebar={toggleSidebar} />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;