import React, { useState } from 'react';
import { 
  Card, CardContent, CardHeader, Box, Typography, 
  TextField, Button, Stepper, Step, StepLabel, 
  Container, Alert, Divider, FormControlLabel, 
  Switch, CircularProgress, Grid, Paper, Snackbar
} from '@mui/material';
import { 
  Domain, Computer, People, Settings, 
  ContentCopy, BackupTable, Email
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const CreateEnvironment = () => {
  const { token } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    clinicName: '',
    serverName: '',
    userCount: 3,
    sendToGoogleSheets: false,
    sendEmail: false,
    emailRecipient: ''
  });

  // Result state
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.post(
          `${API_URL}/api/Clinic/create-environment`, 
        formData,
        config
      );
      
      setResult(response.data);
      setSuccess(true);
      setActiveStep(3); // Move to the results step
    } catch (err) {
      console.error('Error creating environment:', err);
      setError(err.response?.data?.message || 'Error creating environment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSnackbarOpen(true);
  };

  const copyAllCredentials = () => {
    if (!result || !result.createdUsers) return;
    
    const text = result.createdUsers.map(user => 
      `Username: ${user.username}\nPassword: ${user.password}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(text);
    setSnackbarOpen(true);
  };

  const handleNext = () => {
    if (activeStep === 2) {
      handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      clinicName: '',
      serverName: '',
      userCount: 3,
      sendToGoogleSheets: false,
      sendEmail: false,
      emailRecipient: ''
    });
    setResult(null);
    setSuccess(false);
    setError(null);
  };

  const steps = ['Clinic Information', 'User Configuration', 'Reporting Options', 'Results'];

  // Validate current step
  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return formData.clinicName.trim() !== '' && formData.serverName.trim() !== '';
      case 1:
        return formData.userCount > 0;
      case 2:
        return !formData.sendEmail || (formData.emailRecipient && formData.emailRecipient.includes('@'));
      default:
        return true;
    }
  };

  // Render step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ my: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Domain sx={{ mr: 1 }} />
              Clinic Details
            </Typography>
            
            <TextField
              fullWidth
              label="Clinic Name"
              name="clinicName"
              value={formData.clinicName}
              onChange={handleInputChange}
              placeholder="e.g. Clinic Save Bree"
              margin="normal"
              required
              helperText="Enter the full name of the clinic"
            />
            
            <TextField
              fullWidth
              label="Server Name"
              name="serverName"
              value={formData.serverName}
              onChange={handleInputChange}
              placeholder="e.g. CSB01"
              margin="normal"
              required
              helperText="Enter the server name (e.g. CSB01)"
            />
            
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                This will create:
                <ul>
                  <li>OU PROD_{formData.serverName || 'SERVER'} in Clinic OU</li>
                  <li>OU Cloud_{formData.serverName || 'SERVER'} in Servidores OU</li>
                  <li>Move computer {formData.serverName || 'SERVER'} to Cloud OU</li>
                  <li>Create group RDS-{formData.serverName || 'SERVER'}</li>
                </ul>
              </Typography>
            </Alert>
          </Box>
        );
      
      case 1:
        return (
          <Box sx={{ my: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <People sx={{ mr: 1 }} />
              User Configuration
            </Typography>
            
            <TextField
              fullWidth
              label="Number of Users"
              name="userCount"
              type="number"
              value={formData.userCount}
              onChange={handleInputChange}
              margin="normal"
              required
              inputProps={{ min: 1, max: 20 }}
              helperText="How many users to create for this clinic"
            />
            
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                This will create {formData.userCount} users with the following pattern:
                <ul>
                  <li>Usernames: {formData.serverName?.substring(0, 3).toLowerCase() || 'xxx'}1, {formData.serverName?.substring(0, 3).toLowerCase() || 'xxx'}2, ...</li>
                  <li>Secure passwords (format: Word*Word-Word)</li>
                  <li>All users will be added to group RDS-{formData.serverName || 'SERVER'}</li>
                </ul>
              </Typography>
            </Alert>
          </Box>
        );
      
      case 2:
        return (
          <Box sx={{ my: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Settings sx={{ mr: 1 }} />
              Reporting Options
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={formData.sendToGoogleSheets}
                  onChange={handleInputChange}
                  name="sendToGoogleSheets"
                  color="primary"
                />
              }
              label="Save to Google Sheets"
            />
            
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.sendEmail}
                    onChange={handleInputChange}
                    name="sendEmail"
                    color="primary"
                  />
                }
                label="Send Email Report"
              />
              
              {formData.sendEmail && (
                <TextField
                  fullWidth
                  label="Email Recipient"
                  name="emailRecipient"
                  value={formData.emailRecipient}
                  onChange={handleInputChange}
                  margin="normal"
                  required={formData.sendEmail}
                  type="email"
                  placeholder="recipient@example.com"
                  helperText="Enter email address to receive the report"
                />
              )}
            </Box>
            
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Ready to create the environment for {formData.clinicName} ({formData.serverName}).
                Click "Create Environment" to proceed.
              </Typography>
            </Alert>
          </Box>
        );
      
      case 3:
        return (
          <Box sx={{ my: 2 }}>
            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Creating environment...
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                  This may take a minute. We're setting up Active Directory objects.
                </Typography>
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            ) : result ? (
              <Box>
                <Alert severity="success" sx={{ mb: 3 }}>
                  Environment for {result.clinicName} ({result.serverName}) was successfully created!
                </Alert>
                
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <People sx={{ mr: 1 }} />
                  User Credentials
                </Typography>
                
                <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                    <Button 
                      startIcon={<ContentCopy />} 
                      size="small"
                      onClick={copyAllCredentials}
                    >
                      Copy All
                    </Button>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  {result.createdUsers.map((user, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={5}>
                          <Typography variant="subtitle2">
                            Username:
                          </Typography>
                          <Typography variant="body1">
                            {user.username}
                          </Typography>
                        </Grid>
                        <Grid item xs={5}>
                          <Typography variant="subtitle2">
                            Password:
                          </Typography>
                          <Typography variant="body1">
                            {user.password}
                          </Typography>
                        </Grid>
                        <Grid item xs={2} sx={{ textAlign: 'right' }}>
                          <Button 
                            size="small" 
                            onClick={() => copyToClipboard(`Username: ${user.username}\nPassword: ${user.password}`)}
                          >
                            <ContentCopy fontSize="small" />
                          </Button>
                        </Grid>
                      </Grid>
                      {index < result.createdUsers.length - 1 && <Divider sx={{ my: 1 }} />}
                    </Box>
                  ))}
                </Paper>
                
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Computer sx={{ mr: 1 }} />
                  Connection Information
                </Typography>
                
                <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">
                        RDWeb Link:
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography 
                          variant="body2" 
                          component="a" 
                          href={result.rdWebLink} 
                          target="_blank"
                          sx={{ textDecoration: 'none', overflowWrap: 'break-word' }}
                        >
                          {result.rdWebLink}
                        </Typography>
                        <Button 
                          size="small" 
                          onClick={() => copyToClipboard(result.rdWebLink)}
                          sx={{ ml: 1 }}
                        >
                          <ContentCopy fontSize="small" />
                        </Button>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">
                        AnyDesk ID:
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1">
                          {result.anyDeskId || 'Not available'}
                        </Typography>
                        {result.anyDeskId && (
                          <Button 
                            size="small" 
                            onClick={() => copyToClipboard(result.anyDeskId)}
                            sx={{ ml: 1 }}
                          >
                            <ContentCopy fontSize="small" />
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            ) : null}
          </Box>
        );
      
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card>
        <CardHeader
          title="Create Clinic Environment"
          titleTypographyProps={{ variant: 'h5' }}
          subheader="Set up a new clinic with users, OUs, and groups"
        />
        
        <CardContent>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {getStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              variant="outlined"
              disabled={activeStep === 0 || loading}
              onClick={handleBack}
            >
              Back
            </Button>
            
            <Box>
              {activeStep === steps.length - 1 && success ? (
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={handleReset}
                  sx={{ mr: 1 }}
                >
                  Create Another
                </Button>
              ) : null}
              
              {activeStep === steps.length - 1 ? (
                result ? null : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading || !isStepValid()}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Create Environment'}
                  </Button>
                )
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Copied to clipboard"
      />
    </Container>
  );
};

export default CreateEnvironment;