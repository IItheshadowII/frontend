import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaServer, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import authService from '../services/authService';
import './Sidebar.css';

const Sidebar = ({ collapsed }) => {
    const handleLogout = () => {
        authService.logout();
        window.location.href = '/login';
    };

    const user = authService.getCurrentUser();
    const canViewDashboard = authService.hasPermission('ViewDashboard');
    const canViewUserDetails = authService.hasPermission('ViewUserDetails');
    const canModifySettings = authService.hasPermission('ModifySettings');

    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <h2>{collapsed ? 'AD' : 'ADUserGroupManager'}</h2>
            </div>
            <div className="sidebar-user">
                <div className="user-avatar">
                    <FaUser />
                </div>
                {!collapsed && (
                    <div className="user-info">
                        <h3>{user?.username || 'Usuario'}</h3>
                        <p>{user?.fullName || 'Nombre Completo'}</p>
                    </div>
                )}
            </div>
            <nav className="sidebar-nav">
                <ul>
                    {canViewDashboard && (
                        <li>
                            <NavLink to="/dashboard">
                                <FaTachometerAlt />
                                {!collapsed && <span>Dashboard</span>}
                            </NavLink>
                        </li>
                    )}
                    {canViewUserDetails && (
                        <li>
                            <NavLink to="/user-query">
                                <FaUser />
                                {!collapsed && <span>Consulta de Usuario</span>}
                            </NavLink>
                        </li>
                    )}
                    <li>
                        <NavLink to="/cloud-query">
                            <FaServer />
                            {!collapsed && <span>Consulta de Cloud</span>}
                        </NavLink>
                    </li>
                    {canModifySettings && (
                        <li>
                            <NavLink to="/settings">
                                <FaCog />
                                {!collapsed && <span>Configuración</span>}
                            </NavLink>
                        </li>
                    )}
                </ul>
            </nav>
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <FaSignOutAlt />
                    {!collapsed && <span>Cerrar Sesión</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;