import React, { useState } from 'react';
import {
    Card, CardContent, CardHeader, Box, Typography,
    TextField, Button, Container, Alert, Divider,
    CircularProgress, Tabs, Tab, Paper, Grid,
    List, ListItem, ListItemText, ListItemIcon,
    Chip, Dialog, DialogTitle, DialogContent,
    DialogActions, DialogContentText
} from '@mui/material';
import {
    Search, Person, Dns, CalendarToday, Group,
    Lock, LockOpen, Timer, Info, Computer,
    History, Storage, VpnKey, AdminPanelSettings, LockReset,
    CheckCircleOutline
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

// Componente para los botones de acción (un único botón para Enable/Disable, Unlock, Change Password).
// Se fuerza el mismo borderRadius para evitar diferencias visuales.
const ActionButton = ({ children, customStyles, ...props }) => {
    const commonButtonStyle = {
        borderRadius: '4px !important',
        textTransform: 'none',
        backgroundColor: 'transparent',
        padding: '6px 16px',
        boxShadow: 'none',
        fontWeight: 'normal',
        border: '1px solid',
        transition: 'background-color 0.3s, border-color 0.3s'
    };

    return (
        <Button
            sx={{ ...commonButtonStyle, ...customStyles }}
            {...props}
        >
            {children}
        </Button>
    );
};

const Queries = () => {
    const { token } = useAuth();
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cloud Query state
    const [serverCode, setServerCode] = useState('');
    const [cloudQueryResult, setCloudQueryResult] = useState(null);

    // User Query state
    const [username, setUsername] = useState('');
    const [userQueryResult, setUserQueryResult] = useState(null);

    // Admin Password Reset dialog
    const [resetDialogOpen, setResetDialogOpen] = useState(false);
    const [resetServer, setResetServer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [resetError, setResetError] = useState(null);

    // User Password Change dialog
    const [userPasswordDialogOpen, setUserPasswordDialogOpen] = useState(false);
    const [userToChangePassword, setUserToChangePassword] = useState('');
    const [userNewPassword, setUserNewPassword] = useState('');
    const [userPasswordLoading, setUserPasswordLoading] = useState(false);
    const [userPasswordSuccess, setUserPasswordSuccess] = useState(false);
    const [userPasswordError, setUserPasswordError] = useState(null);

    // User Action Loading
    const [userActionLoading, setUserActionLoading] = useState(false);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setCloudQueryResult(null);
        setUserQueryResult(null);
        setError(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    // --- Cloud Query ---
    const handleCloudQuery = async () => {
        if (!serverCode.trim()) return;

        setLoading(true);
        setError(null);
        setCloudQueryResult(null);

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const response = await axios.get(
                `${API_URL}/api/clinic/query/${serverCode.trim()}`,
                config
            );

            setCloudQueryResult(response.data);
        } catch (err) {
            console.error('Error executing cloud query:', err);
            setError(err?.response?.data?.message || 'Error executing query. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // --- User Query ---
    const handleUserQuery = async () => {
        if (!username.trim()) return;

        setLoading(true);
        setError(null);
        setUserQueryResult(null);

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const response = await axios.get(
                `${API_URL}/api/user/query/${username.trim()}`,
                config
            );

            setUserQueryResult(response.data);
            console.log("User query result:", response.data);
        } catch (err) {
            console.error('Error executing user query:', err);
            setError(err.response?.data?.message || 'Error executing query. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // --- Admin Password Reset ---
    const openResetDialog = (server) => {
        setResetServer(server);
        setNewPassword('');
        setResetSuccess(false);
        setResetError(null);
        setResetDialogOpen(true);
    };

    const handleResetAdminPassword = async () => {
        if (!resetServer || !newPassword) return;

        setResetLoading(true);
        setResetError(null);

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.post(
                `${API_URL}/api/clinic/reset-admin-password`,
                {
                    serverName: resetServer,
                    newPassword: newPassword
                },
                config
            );

            setResetSuccess(true);
        } catch (err) {
            console.error('Error resetting admin password:', err);
            setResetError(err.response?.data?.message || 'Error resetting password. Please try again.');
        } finally {
            setResetLoading(false);
        }
    };

    // --- User Password Change ---
    const openUserPasswordDialog = (username) => {
        setUserToChangePassword(username);
        setUserNewPassword('');
        setUserPasswordSuccess(false);
        setUserPasswordError(null);
        setUserPasswordDialogOpen(true);
    };

    const handleChangeUserPassword = async () => {
        if (!userToChangePassword || !userNewPassword) return;

        setUserPasswordLoading(true);
        setUserPasswordError(null);

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.post(
                `${API_URL}/api/user/change-password`,
                {
                    username: userToChangePassword,
                    newPassword: userNewPassword
                },
                config
            );

            setUserPasswordSuccess(true);
        } catch (err) {
            console.error('Error changing user password:', err);
            setUserPasswordError(err.response?.data?.message || 'Error changing password. Please try again.');
        } finally {
            setUserPasswordLoading(false);
        }
    };

    // --- User Enable/Disable/Unlock ---
    const handleDisableUser = async () => {
        if (!userQueryResult) return;

        setUserActionLoading(true);
        setError(null);

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.post(
                `${API_URL}/api/user/disable`,
                { username: userQueryResult.username },
                config
            );

            // Refresh user data
            await handleUserQuery();

        } catch (err) {
            console.error('Error disabling user:', err);
            setError(err.response?.data?.message || 'Error disabling user. Please try again.');
        } finally {
            setUserActionLoading(false);
        }
    };

    const handleEnableUser = async () => {
        if (!userQueryResult) return;

        setUserActionLoading(true);
        setError(null);

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.post(
                `${API_URL}/api/user/enable`,
                { username: userQueryResult.username },
                config
            );

            // Refresh user data
            await handleUserQuery();

        } catch (err) {
            console.error('Error enabling user:', err);
            setError(err.response?.data?.message || 'Error enabling user. Please try again.');
        } finally {
            setUserActionLoading(false);
        }
    };

    const handleUnlockUser = async () => {
        if (!userQueryResult) return;

        setUserActionLoading(true);
        setError(null);

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.post(
                `${API_URL}/api/user/unlock`,
                { username: userQueryResult.username },
                config
            );

            // Refresh user data
            await handleUserQuery();

        } catch (err) {
            console.error('Error unlocking user:', err);
            setError(err.response?.data?.message || 'Error unlocking user. Please try again.');
        } finally {
            setUserActionLoading(false);
        }
    };

    // --- Render Cloud Query ---
    const renderCloudQueryContent = () => (
        <>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 3 }}>
                <Dns sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                <TextField
                    fullWidth
                    label="Server Code"
                    variant="standard"
                    value={serverCode}
                    onChange={(e) => setServerCode(e.target.value)}
                    placeholder="e.g. CSB01"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCloudQuery}
                    disabled={loading || !serverCode.trim()}
                    sx={{ ml: 2 }}
                    startIcon={<Search />}
                >
                    Query
                </Button>
            </Box>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {cloudQueryResult && (
                <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                            <Computer sx={{ mr: 1 }} />
                            {cloudQueryResult.clinicName} ({cloudQueryResult.serverCode})
                        </Typography>

                        <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            startIcon={<AdminPanelSettings />}
                            onClick={() => openResetDialog(cloudQueryResult.serverCode)}
                        >
                            Reset Admin Password
                        </Button>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon>
                                        <CalendarToday />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Creation Date"
                                        secondary={formatDate(cloudQueryResult.creationDate)}
                                    />
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <Person />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Created By"
                                        secondary={cloudQueryResult.createdBy || 'Unknown'}
                                    />
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <Group />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Number of Users"
                                        secondary={cloudQueryResult.userCount}
                                    />
                                </ListItem>
                            </List>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon>
                                        <History />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Last Reboot"
                                        secondary={formatDate(cloudQueryResult.lastReboot)}
                                    />
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <Storage />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Current OU"
                                        secondary={cloudQueryResult.currentComputerOU || 'N/A'}
                                    />
                                </ListItem>
                            </List>
                        </Grid>
                    </Grid>
                </Paper>
            )}
        </>
    );

    // --- Render User Query ---
    const renderUserQueryContent = () => (
        <>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 3 }}>
                <Person sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                <TextField
                    fullWidth
                    label="Username"
                    variant="standard"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. csb1"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUserQuery}
                    disabled={loading || !username.trim()}
                    sx={{ ml: 2 }}
                    startIcon={<Search />}
                >
                    Query
                </Button>
            </Box>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {userQueryResult && (
                <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                            <Person sx={{ mr: 1 }} />
                            {userQueryResult.username}
                            {userQueryResult.fullName && ` (${userQueryResult.fullName})`}
                        </Typography>
                    </Box>

                    {/* Unificamos el Chip de estado y un único botón para Enable/Disable */}
                    <Box
                        sx={{
                            mb: 3,
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'nowrap',
                            gap: 2
                        }}
                    >
                        {/* Chip Disabled/Enabled */}
                        

                        {/* Botón único para alternar Enable/Disable */}
                        <ActionButton
                            customStyles={{
                                borderColor: '#2e7d32',
                                color: '#2e7d32',
                                '&:hover': {
                                    backgroundColor: 'rgba(46, 125, 50, 0.04)',
                                    borderColor: '#2e7d32'
                                }
                            }}
                            startIcon={
                                userQueryResult.isDisabled
                                    ? <LockOpen style={{ color: '#2e7d32' }} />
                                    : <Lock style={{ color: '#2e7d32' }} />
                            }
                            onClick={userQueryResult.isDisabled ? handleEnableUser : handleDisableUser}
                            disabled={userActionLoading}
                        >
                            {userQueryResult.isDisabled ? 'Enable' : 'Disable'}
                        </ActionButton>

                        {/* Botón Unlock */}
                        <ActionButton
                            customStyles={{
                                borderColor: '#e0e0e0',
                                color: '#9e9e9e',
                                '&:hover': {
                                    backgroundColor: 'rgba(158, 158, 158, 0.04)',
                                    borderColor: '#9e9e9e'
                                }
                            }}
                            startIcon={<LockReset style={{ color: '#9e9e9e' }} />}
                            onClick={handleUnlockUser}
                            disabled={userActionLoading || !userQueryResult.isLocked}
                        >
                            Unlock
                        </ActionButton>

                        {/* Botón Change Password */}
                        <ActionButton
                            customStyles={{
                                borderColor: '#ffecb3',
                                color: '#ed6c02',
                                '&:hover': {
                                    backgroundColor: 'rgba(237, 108, 2, 0.04)',
                                    borderColor: '#ed6c02'
                                }
                            }}
                            startIcon={<VpnKey style={{ color: '#ed6c02' }} />}
                            onClick={() => openUserPasswordDialog(userQueryResult.username)}
                            disabled={userActionLoading}
                        >
                            Change Password
                        </ActionButton>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon>
                                        <Info />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Description"
                                        secondary={userQueryResult.description || 'No description'}
                                    />
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <Person />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Created By"
                                        secondary={userQueryResult.createdBy || 'Unknown'}
                                    />
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <Timer />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Password Last Set"
                                        secondary={formatDate(userQueryResult.passwordLastSet)}
                                    />
                                </ListItem>
                            </List>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Group Memberships:</Typography>

                            {userQueryResult.groups && userQueryResult.groups.length > 0 ? (
                                <List dense>
                                    {userQueryResult.groups.map((group, index) => (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                <Group fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText primary={group} />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="body2" color="textSecondary">
                                    No group memberships found
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                </Paper>
            )}
        </>
    );

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Card>
                <CardHeader
                    title="Queries"
                    titleTypographyProps={{ variant: 'h5' }}
                    subheader="Look up information about clinics and users"
                />

                <CardContent>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        sx={{ mb: 3 }}
                    >
                        <Tab icon={<Dns />} label="Cloud Query" />
                        <Tab icon={<Person />} label="User Query" />
                    </Tabs>

                    <Box role="tabpanel" hidden={tabValue !== 0}>
                        {tabValue === 0 && renderCloudQueryContent()}
                    </Box>

                    <Box role="tabpanel" hidden={tabValue !== 1}>
                        {tabValue === 1 && renderUserQueryContent()}
                    </Box>
                </CardContent>
            </Card>

            {/* Admin Password Reset Dialog */}
            <Dialog
                open={resetDialogOpen}
                onClose={() => setResetDialogOpen(false)}
                aria-labelledby="reset-dialog-title"
            >
                <DialogTitle id="reset-dialog-title">
                    Reset Local Administrator Password
                </DialogTitle>

                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        This will reset the local Administrator password on {resetServer}.
                        Please enter a new secure password.
                    </DialogContentText>

                    {resetError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {resetError}
                        </Alert>
                    )}

                    {resetSuccess && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Administrator password was successfully reset for {resetServer}!
                        </Alert>
                    )}

                    <TextField
                        autoFocus
                        margin="dense"
                        label="New Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={resetLoading || resetSuccess}
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => setResetDialogOpen(false)}
                        color="primary"
                    >
                        {resetSuccess ? 'Close' : 'Cancel'}
                    </Button>

                    {!resetSuccess && (
                        <Button
                            onClick={handleResetAdminPassword}
                            color="primary"
                            variant="contained"
                            disabled={resetLoading || !newPassword}
                            startIcon={resetLoading ? <CircularProgress size={20} /> : <VpnKey />}
                        >
                            Reset Password
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* User Password Change Dialog */}
            <Dialog
                open={userPasswordDialogOpen}
                onClose={() => setUserPasswordDialogOpen(false)}
                aria-labelledby="user-password-dialog-title"
            >
                <DialogTitle id="user-password-dialog-title">
                    Change User Password
                </DialogTitle>

                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        This will set a new password for user {userToChangePassword}.
                        Please enter a new secure password.
                    </DialogContentText>

                    {userPasswordError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {userPasswordError}
                        </Alert>
                    )}

                    {userPasswordSuccess && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Password was successfully changed for {userToChangePassword}!
                        </Alert>
                    )}

                    <TextField
                        autoFocus
                        margin="dense"
                        label="New Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={userNewPassword}
                        onChange={(e) => setUserNewPassword(e.target.value)}
                        disabled={userPasswordLoading || userPasswordSuccess}
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => setUserPasswordDialogOpen(false)}
                        color="primary"
                    >
                        {userPasswordSuccess ? 'Close' : 'Cancel'}
                    </Button>

                    {!userPasswordSuccess && (
                        <Button
                            onClick={handleChangeUserPassword}
                            color="primary"
                            variant="contained"
                            disabled={userPasswordLoading || !userNewPassword}
                            startIcon={userPasswordLoading ? <CircularProgress size={20} /> : <VpnKey />}
                        >
                            Change Password
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Queries;
