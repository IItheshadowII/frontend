import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Componente que muestra la información de permisos del usuario actual
function UserPermissions() {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Función para obtener información del usuario autenticado
        const fetchUserInfo = async () => {
            try {
                setLoading(true);
                // Usar endpoint para obtener información del usuario Windows autenticado
                const response = await axios.get('/api/WindowsAuth/user-info', {
                    withCredentials: true // Importante para Windows Auth
                });
                setUserInfo(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching user info:', err);
                setError('No se pudo obtener la información del usuario.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    if (loading) {
        return <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
        </div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!userInfo) {
        return <div className="alert alert-warning">No se pudo cargar la información del usuario.</div>;
    }

    return (
        <div className="card">
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Información del Usuario</h5>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <h6>Detalles del Usuario</h6>
                    <p><strong>Usuario:</strong> {userInfo.username}</p>
                </div>

                <div className="mb-3">
                    <h6>Permisos</h6>
                    <ul className="list-group">
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            Crear Usuarios
                            {userInfo.canCreateUsers ?
                                <span className="badge bg-success rounded-pill">Permitido</span> :
                                <span className="badge bg-danger rounded-pill">Denegado</span>}
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            Modificar Usuarios
                            {userInfo.canModifyUsers ?
                                <span className="badge bg-success rounded-pill">Permitido</span> :
                                <span className="badge bg-danger rounded-pill">Denegado</span>}
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            Crear Entorno de Clínica
                            {userInfo.canCreateClinicEnvironment ?
                                <span className="badge bg-success rounded-pill">Permitido</span> :
                                <span className="badge bg-danger rounded-pill">Denegado</span>}
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            Administrador
                            {userInfo.isAdministrator ?
                                <span className="badge bg-success rounded-pill">Permitido</span> :
                                <span className="badge bg-danger rounded-pill">Denegado</span>}
                        </li>
                    </ul>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <h6>Grupos de AD</h6>
                            {userInfo.groups && userInfo.groups.length > 0 ? (
                                <ul className="list-group">
                                    {userInfo.groups.map((group, index) => (
                                        <li key={index} className="list-group-item">{group}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted">No pertenece a ningún grupo.</p>
                            )}
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="mb-3">
                            <h6>Roles en la Aplicación</h6>
                            {userInfo.roles && userInfo.roles.length > 0 ? (
                                <ul className="list-group">
                                    {userInfo.roles.map((role, index) => (
                                        <li key={index} className="list-group-item">{role}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted">No tiene roles asignados.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserPermissions;