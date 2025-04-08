import React, { useState } from 'react';
import {
    Card, CardContent, CardHeader, Box, Typography,
    TextField, Button, Container, Alert, Paper,
    CircularProgress, FormControlLabel, Checkbox,
    InputAdornment, IconButton
} from '@mui/material';
import {
    LockOutlined, Visibility, VisibilityOff, LoginOutlined
} from '@mui/icons-material';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { isAuthenticated, login, loading, error } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) return;

        const success = await login(username, password, rememberMe);
        if (success) {
            navigate('/dashboard');
        }
    };

    // Si el usuario ya está autenticado, se redirige al dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <Container component="main" maxWidth="sm" sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh'
        }}>
            <Paper elevation={3} sx={{ width: '100%', borderRadius: 2 }}>
                <Card>
                    <CardHeader
                        title="ADUserGroupManager Web"
                        titleTypographyProps={{ variant: 'h5', align: 'center' }}
                        subheader="Active Directory Clinic Management"
                        subheaderTypographyProps={{ align: 'center' }}
                        sx={{ pb: 0 }}
                    />

                    <CardContent>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{ mt: 2 }}
                        >
                            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                                <LockOutlined color="primary" fontSize="large" />
                            </Box>

                            <Typography variant="h6" align="center" gutterBottom>
                                Sign In
                            </Typography>

                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        value="remember"
                                        color="primary"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        disabled={loading}
                                    />
                                }
                                label="Remember me"
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={loading || !username || !password}
                                startIcon={loading ? <CircularProgress size={20} /> : <LoginOutlined />}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </Button>

                            <Typography variant="body2" align="center" sx={{ mt: 2, color: 'text.secondary' }}>
                                Sign in with your Active Directory credentials
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Paper>
        </Container>
    );
};

export default Login;
