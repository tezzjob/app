import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Grid, CircularProgress } from '@mui/material';
import { API_ENDPOINT_URL } from '../config';

const ApplyToJob = () => {
  const location = useLocation();
  const [message, setMessage] = useState('Applying to job...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const jobId = queryParams.get('jobId');
    const employeeId = queryParams.get('employeeId');

    const applyToJob = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT_URL}/apply-to-job?employeeId=${employeeId}&jobId=${jobId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setMessage(errorData.message || 'Failed to apply to job');
          return;
        }

        setMessage('Applied to job successfully');
      } catch (err) {
        setMessage('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    applyToJob();
  }, [location.search]);

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
      <Grid item>
        {loading ? (
          <CircularProgress />
        ) : (
          <Typography variant="h6" component="div" gutterBottom>
            {message}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default ApplyToJob;