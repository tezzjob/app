import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Grid2 from '@mui/material/Grid2'; // Import Grid2 from @mui/material
import logo from '../../public/images/tezzjob-logo.png'; // Replace with your logo

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <AppBar
        sx={{ background: '#fff', boxShadow: 'none' }}
        position="static"
        color="primary"
      >
        <Toolbar>
          <Grid2
            sx={{
              display: 'flex',
              justifyContent: { xs: 'space-between', sm: 'unset' },
              textAlign: { xs: 'center', sm: 'left' },
              flexGrow: 1,
            }}
          >
            <Grid2
              sx={{
                display: 'flex',
                alignItems: 'center',
                paddingLeft: { xs: 'none', md: '200px' },
              }}
              onClick={() => window.location.replace('/')}
            >
              <img src={logo} alt="logo" width={250} />
            </Grid2>
            {/* Navigation Links for Larger Screens */}
            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                paddingLeft: { xs: 'none', sm: '250px' },
                justifyContent: 'space-between',
                width: '30%',
              }}
            >
              <Button
                component={Link}
                to="/persona-selection"
                sx={{ fontSize: '18px' }}
              >
                Get Started
              </Button>
              <Button component={Link} to="/about" sx={{ fontSize: '18px' }}>
                About
              </Button>
            </Box>

            {/* Hamburger Menu for Small Screens */}
            <IconButton
              edge="end"
              aria-label="menu"
              sx={{ display: { xs: 'block', sm: 'none' } }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          </Grid2>
        </Toolbar>
      </AppBar>

      {/* Drawer for Small Screens */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
        <List sx={{ width: 250 }}>
          <ListItem component={Link} to="/" onClick={handleDrawerToggle}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem component={Link} to="/about" onClick={handleDrawerToggle}>
            <ListItemText primary="About" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}

export default App;
