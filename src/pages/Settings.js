import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import {
  Container, Card, CardHeader, CardContent, Box, Typography, 
  Divider, FormControl, InputLabel, Select, MenuItem, 
  TextField, Button, Grid, Paper, Switch, FormControlLabel, 
  Alert, Snackbar
} from '@mui/material';
import { Save as SaveIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';




const Settings = () => {
  const { token } = useAuth();
  const [settings, setSettings] = useState({
    environment: 'Production',
    googleSheets: {
      enabled: false,
      spreadsheetId: '',
      clinicSheet: 'Clinics'
    },
    email: {
      enabled: false,
      smtpServer: '',
      smtpPort: 587,
      username: '',
      password: '',
      fromAddress: ''
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        
          const response = await axios.get(`${API_URL}/api/settings`, config);
        setSettings(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError('Error loading settings. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [token]);
  
  const handleChange = (section, field, value) => {
    if (section) {
      setSettings({
        ...settings,
        [section]: {
          ...settings[section],
          [field]: value
        }
      });
    } else {
      setSettings({
        ...settings,
        [field]: value
      });
    }
  };
  
  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
        await axios.post(`${API_URL}/api/settings`, settings, config);
      setSuccess(true);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Error saving settings. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card>
        <CardHeader
          title="Application Settings"
          titleTypographyProps={{ variant: 'h5' }}
          subheader="Configure system settings and integrations"
        />
        
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Environment Settings
            </Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="environment-mode-label">Environment Mode</InputLabel>
                  <Select
                    labelId="environment-mode-label"
                    id="environment-mode"
                    value={settings.environment}
                    onChange={(e) => handleChange(null, 'environment', e.target.value)}
                    label="Environment Mode"
                  >
                    <MenuItem value="Production">Production</MenuItem>
                    <MenuItem value="Lab">Lab Environment</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Google Sheets Integration
            </Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.googleSheets.enabled}
                      onChange={(e) => handleChange('googleSheets', 'enabled', e.target.checked)}
                    />
                  }
                  label="Enable Google Sheets Integration"
                />
              </Grid>
              
              {settings.googleSheets.enabled && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Spreadsheet ID"
                      value={settings.googleSheets.spreadsheetId}
                      onChange={(e) => handleChange('googleSheets', 'spreadsheetId', e.target.value)}
                      helperText="ID from the Google Sheets URL"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Clinic Sheet Name"
                      value={settings.googleSheets.clinicSheet}
                      onChange={(e) => handleChange('googleSheets', 'clinicSheet', e.target.value)}
                      helperText="Name of the sheet to store clinic data"
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Email Settings
            </Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.email.enabled}
                      onChange={(e) => handleChange('email', 'enabled', e.target.checked)}
                    />
                  }
                  label="Enable Email Notifications"
                />
              </Grid>
              
              {settings.email.enabled && (
                <>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="SMTP Server"
                      value={settings.email.smtpServer}
                      onChange={(e) => handleChange('email', 'smtpServer', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="SMTP Port"
                      type="number"
                      value={settings.email.smtpPort}
                      onChange={(e) => handleChange('email', 'smtpPort', parseInt(e.target.value))}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="SMTP Username"
                      value={settings.email.username}
                      onChange={(e) => handleChange('email', 'username', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="SMTP Password"
                      type="password"
                      value={settings.email.password}
                      onChange={(e) => handleChange('email', 'password', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="From Email Address"
                      value={settings.email.fromAddress}
                      onChange={(e) => handleChange('email', 'fromAddress', e.target.value)}
                      helperText="Email address to send notifications from"
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => window.location.reload()}
            >
              Reset
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saveLoading}
            >
              Save Settings
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        message="Settings saved successfully"
      />
    </Container>
  );
};

export default Settings;