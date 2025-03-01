import { Box, Container, Grid2, Paper, Typography } from '@mui/material';
import React from 'react'
import { Link } from 'react-router-dom';

const PersonaSelection = () => {
  return (
    <Grid2>
      <Grid2
        sx={{
          height: '100px',
          background: '#eee8ff',
          alignContent: 'center',
          my: '30px',
        }}
      >
        <Typography variant="h4" component="h3" sx={{ textAlign: 'center' }}>
          Pick your Role to Get started
        </Typography>
      </Grid2>
      <Grid2
        display={'flex'}
        flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent={{ xs: 'space-evenly', md: 'center' }}
        gap={{ xs: 0, md: 10 }}
      >
        {/* todo: animate this */}
        <Paper
          elevation={10}
          sx={{
            width: { xs: '80%', md: '300px' },
            padding: { xs: 2, sm: 5, md: 10 },
            borderRadius: 5,
            marginX: { xs: 'auto', md: '20px' },
            marginY: '20px',
            textDecoration: 'none',
          }}
          component={Link}
          to={'/employee-registration'}
        >
          {/* Image Section */}
          <Box
            component="img"
            src="../../public/images/job-search.png"
            alt="Job Search Icon"
            sx={{
              display: 'block', // Center the image
              margin: '0 auto', // Auto margins for horizontal centering
              width: 100, // Set image width
              height: 'auto', // Maintain aspect ratio
              borderRadius: 4, // Optional: rounded corners
              mb: 2, // Margin below image
            }}
          />

          {/* Typography Section */}
          <Typography
            component="h1"
            variant="h5"
            sx={{
              textAlign: 'center',
              pt: 1,
              mt: 4,
              fontWeight: 'bold',
              color: '#2b2b2b',
            }}
          >
            Employee
          </Typography>
          <Typography
            component="h1"
            variant="h6"
            sx={{ textAlign: 'center', pt: 1 }}
          >
            Find a job
          </Typography>
        </Paper>
        <Paper
          elevation={10}
          sx={{
            width: { xs: '80%', md: '300px' },
            padding: { xs: 2, sm: 5, md: 10 },
            borderRadius: 5,
            marginX: { xs: 'auto', md: '20px' },
            marginY: { xs: '10px', md: '20px' },
            textDecoration: 'none',
          }}
          component={Link}
          to={'/shopkeeper-login'}
        >
          {/* Image Section */}
          <Box
            component="img"
            src="../../public/images/person-search.png"
            alt="Job Search Icon"
            sx={{
              display: 'block', // Center the image
              margin: '0 auto', // Auto margins for horizontal centering
              width: 100, // Set image width
              height: 'auto', // Maintain aspect ratio
              borderRadius: 4, // Optional: rounded corners
              mb: 2, // Margin below image
            }}
          />

          {/* Typography Section */}
          <Typography
            component="h1"
            variant="h5"
            sx={{
              textAlign: 'center',
              pt: 1,
              mt: 4,
              fontWeight: 'bold',
              color: '#2b2b2b',
            }}
          >
            Business Owner
          </Typography>
          <Typography
            component="h1"
            variant="h6"
            sx={{ textAlign: 'center', pt: 1 }}
          >
            Hire workers
          </Typography>
        </Paper>
      </Grid2>
    </Grid2>
  );
}

export default PersonaSelection
