import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh'
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          textAlign: 'center', 
          borderRadius: 2
        }}
      >
        <Typography variant="h1" color="textSecondary" sx={{ mb: 2 }}>
          404
        </Typography>
        
        <Typography variant="h5" color="textPrimary" sx={{ mb: 2 }}>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/"
          startIcon={<HomeIcon />}
        >
          Back to Home
        </Button>
      </Paper>
    </Container>
  );
};

export default NotFound;