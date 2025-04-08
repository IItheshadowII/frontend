import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Navbar() {
    const { currentUser, permissions } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">AD Manager</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Dashboard</Link>
                        </li>

                        {/* Sección de Usuarios - Solo visible para quienes pueden gestionar usuarios */}
                        {(permissions.canCreateUsers || permissions.canModifyUsers) && (
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="usersDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Usuarios
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="usersDropdown">
                                    <li><Link className="dropdown-item" to="/users">Listar Usuarios</Link></li>
                                    {permissions.canCreateUsers && (
                                        <li><Link className="dropdown-item" to="/users/create">Crear Usuario</Link></li>
                                    )}
                                    {permissions.canModifyUsers && (
                                        <li><Link className="dropdown-item" to="/users/manage">Administrar Usuarios</Link></li>
                                    )}
                                </ul>
                            </li>
                        )}

                        {/* Sección de Clínicas - Solo visible para quienes pueden crear entornos */}
                        {permissions.canCreateClinicEnvironment && (
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="clinicsDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Clínicas
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="clinicsDropdown">
                                    <li><Link className="dropdown-item" to="/clinics">Listar Clínicas</Link></li>
                                    <li><Link className="dropdown-item" to="/clinics/create">Crear Entorno</Link></li>
                                    <li><Link className="dropdown-item" to="/clinics/add-users">Agregar Usuarios</Link></li>
                                </ul>
                            </li>
                        )}

                        {/* Configuración - Solo visible para administradores */}
                        {permissions.isAdministrator && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/settings">Configuración</Link>
                            </li>
                        )}
                    </ul>

                    {/* Información del usuario */}
                    {currentUser && (
                        <ul className="navbar-nav">
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="userDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {currentUser.username}
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                    <li><Link className="dropdown-item" to="/profile">Perfil</Link></li>
                                    <li><Link className="dropdown-item" to="/permissions">Mis Permisos</Link></li>
                                </ul>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;