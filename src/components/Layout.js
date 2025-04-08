import React, { useState } from 'react';
import { 
  Box, Drawer, AppBar, Toolbar, List, Typography, 
  Divider, IconButton, ListItem, ListItemIcon, 
  ListItemText, Tooltip, Menu, MenuItem,
  Avatar, useMediaQuery, useTheme, CssBaseline
} from '@mui/material';
import { 
  Menu as MenuIcon, Dashboard, GroupAdd, Storage,
  Dns, Person, Settings, Logout, ChevronLeft
} from '@mui/icons-material';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };
  
  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Create Environment', icon: <GroupAdd />, path: '/create-environment' },
    { text: 'Queries', icon: <Storage />, path: '/queries' },
    // Can add more menu items here as needed
  ];
  
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: open ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { md: open ? `${drawerWidth}px` : 0 },
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            {open ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            ADUserGroupManager Web
          </Typography>
          
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
                {user.fullName || user.username}
              </Typography>
              
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleProfileMenuOpen}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls="profile-menu"
                  aria-haspopup="true"
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {(user.fullName?.[0] || user.username?.[0] || 'U').toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      {/* Profile Menu */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { 
          handleMenuClose(); 
          navigate('/settings'); 
        }}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={isMobile ? open : true}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                onClick={isMobile ? handleDrawerToggle : undefined}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(25, 118, 210, 0.12)',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.20)',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      
      {/* Main Content */}
      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: 3, 
        width: { sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
        ml: { md: open ? `${drawerWidth}px` : 0 },
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        })
      }}>
        <Toolbar /> {/* This provides spacing below the AppBar */}
        {children}
      </Box>
    </Box>
  );
};

export default Layout;