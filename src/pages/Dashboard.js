import React, { useState, useEffect } from 'react';
import {
    Card, CardContent, CardHeader, Box, Typography, Grid,
    Container, CircularProgress, Button, Alert, Chip
} from '@mui/material';
import {
    AccountCircle, Computer, GroupWork, Warning, CheckCircle,
    LockOutlined, LockOpen, CloudOff, NetworkCheck, Analytics
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const Dashboard = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [credentialStats, setCredentialStats] = useState(null);
    const [userStats, setUserStats] = useState(null);
    const [error, setError] = useState(null);

    // Colors for charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const CREDENTIAL_COLORS = ['#FF0000', '#FFBB28', '#00C49F', '#0088FE'];

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                // Llamadas en paralelo
                const [
                    summaryResponse,
                    alertsResponse,
                    credentialResponse,
                    userStatsResponse
                ] = await Promise.all([
                    axios.get(`${API_URL}/api/dashboard/summary`, config),
                    axios.get(`${API_URL}/api/dashboard/alerts`, config),
                    axios.get(`${API_URL}/api/dashboard/credential-age-stats`, config),
                    axios.get(`${API_URL}/api/dashboard/users-created-stats`, config),
                ]);

                // Seteo de estados (r�pido)
                setSummary(summaryResponse.data);
                setAlerts(alertsResponse.data.alerts);
                setCredentialStats(credentialResponse.data);
                setUserStats(userStatsResponse.data);

                setError(null);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Error loading dashboard data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };


        fetchDashboardData();
    }, [token]);

    if (loading) {
        return (
            <Container sx={{ textAlign: 'center', my: 5 }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>Loading dashboard data...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ my: 5 }}>
                <Alert severity="error">{error}</Alert>
                <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => window.location.reload()}
                >
                    Retry
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Dashboard
            </Typography>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <AccountCircle color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Users</Typography>
                            </Box>
                            <Typography variant="h4">{summary?.totalUsers || 0}</Typography>
                            <Box sx={{ display: 'flex', mt: 1, flexWrap: 'wrap', gap: 1 }}>
                                <Chip
                                    size="small"
                                    icon={<LockOpen fontSize="small" />}
                                    label={`${summary?.activeUsers || 0} Active`}
                                    color="success"
                                />
                                <Chip
                                    size="small"
                                    icon={<LockOutlined fontSize="small" />}
                                    label={`${summary?.lockedUsers || 0} Locked`}
                                    color={summary?.lockedUsers > 0 ? "warning" : "default"}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Computer color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Servers</Typography>
                            </Box>
                            <Typography variant="h4">{summary?.totalServers || 0}</Typography>
                            <Box sx={{ display: 'flex', mt: 1, flexWrap: 'wrap', gap: 1 }}>
                                <Chip
                                    size="small"
                                    icon={<NetworkCheck fontSize="small" />}
                                    label={`${summary?.serversOnline || 0} Online`}
                                    color="success"
                                />
                                <Chip
                                    size="small"
                                    icon={<CloudOff fontSize="small" />}
                                    label={`${summary?.serversOffline || 0} Offline`}
                                    color={summary?.serversOffline > 0 ? "error" : "default"}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <GroupWork color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Clinics</Typography>
                            </Box>
                            <Typography variant="h4">{summary?.totalClinics || 0}</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                                Total managed clinic environments
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Analytics color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Active Today</Typography>
                            </Box>
                            <Typography variant="h4">{userStats?.createdToday || 0}</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                                {userStats?.createdThisMonth || 0} users created this month
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Alerts Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader
                            title="Items Requiring Attention"
                            titleTypographyProps={{ variant: 'h6' }}
                        />
                        <CardContent>
                            {alerts && alerts.length > 0 ? (
                                alerts.map((alert, index) => (
                                    <Alert
                                        key={index}
                                        severity={alert.type.toLowerCase()}
                                        sx={{ mb: 2 }}
                                    >
                                        <Typography variant="subtitle1">{alert.message}</Typography>
                                        {alert.relatedItems && alert.relatedItems.length > 0 && (
                                            <Box component="ul" sx={{ pl: 2, mt: 1, mb: 0 }}>
                                                {alert.relatedItems.slice(0, 3).map((item, i) => (
                                                    <Typography component="li" key={i} variant="body2">
                                                        {item}
                                                    </Typography>
                                                ))}
                                                {alert.relatedItems.length > 3 && (
                                                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                                        ...and {alert.relatedItems.length - 3} more items
                                                    </Typography>
                                                )}
                                            </Box>
                                        )}
                                    </Alert>
                                ))
                            ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
                                    <CheckCircle color="success" sx={{ mr: 1 }} />
                                    <Typography>All systems operational. No issues detected.</Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardHeader
                            title="Credential Age Distribution"
                            titleTypographyProps={{ variant: 'h6' }}
                        />
                        <CardContent>
                            {credentialStats ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={credentialStats.chartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="count"
                                            nameKey="category"
                                        >
                                            {credentialStats.chartData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={CREDENTIAL_COLORS[index % CREDENTIAL_COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                                    <CircularProgress />
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardHeader
                            title="Users Created (Last 6 Months)"
                            titleTypographyProps={{ variant: 'h6' }}
                        />
                        <CardContent>
                            {userStats && userStats.chartData ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart
                                        data={userStats.chartData.slice(-6)} // Last 6 months
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => [`${value} users`, 'Created']} />
                                        <Legend />
                                        <Bar dataKey="count" name="Users Created" fill="#4CAF50" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                                    <CircularProgress />
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/create-environment')}
                >
                    Create New Environment
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/queries')}
                >
                    Run Queries
                </Button>
            </Box>
        </Container>
    );
};

export default Dashboard;
