import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import StoreIcon from '@mui/icons-material/Store';

const EmployeeShops = () => {
  // Employee details
  const employee = {
    name: 'Rajesh Kumar',
    preferredLocation: 'MG Road, Bangalore',
  };

  // Suggested nearby shops
  const nearbyShops = [
    {
      name: 'Sharma General Store',
      owner: 'Mr. Sharma',
      contact: '9876543210',
    },
    { name: 'Gupta Electronics', owner: 'Mrs. Gupta', contact: '8765432109' },
    { name: 'Mehta Bakery', owner: 'Mr. Mehta', contact: '7654321098' },
  ];

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      {/* Employee Summary Card */}
      <Card
        elevation={5}
        sx={{ borderRadius: 3, bgcolor: '#f5f5f5', textAlign: 'center', p: 2 }}
      >
        <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
          <PersonIcon />
        </Avatar>
        <Typography variant="h5" fontWeight={600}>
          {employee.name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Preferred Location: <strong>{employee.preferredLocation}</strong>
        </Typography>
      </Card>

      {/* Nearby Shops List */}
      <Card elevation={5} sx={{ borderRadius: 3, mt: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Nearby Shops
          </Typography>
          <List>
            {nearbyShops.map((shop, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                    <StoreIcon />
                  </Avatar>
                  <ListItemText
                    primary={shop.name}
                    secondary={`Owner: ${shop.owner} | Contact: ${shop.contact}`}
                  />
                </ListItem>
                {index < nearbyShops.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmployeeShops;
