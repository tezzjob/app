import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_ENDPOINT_URL } from '../config';

const CreateJob = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [salaryPerMonth, setSalaryPerMonth] = useState<number | string>('');
  const [timingFrom, setTimingFrom] = useState('');
  const [timingFromPeriod, setTimingFromPeriod] = useState('AM');
  const [timingTo, setTimingTo] = useState('');
  const [timingToPeriod, setTimingToPeriod] = useState('AM');
const [error, setError] = useState<string | null>(null);
    
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const jobData = {
      jobTitle,
      salaryPerMonth,
      timingFrom: `${timingFrom} ${timingFromPeriod}`,
      timingTo: `${timingTo} ${timingToPeriod}`,
    };

    const encodedPayload = btoa(JSON.stringify(jobData));

    try {
      const response = await fetch(`${API_ENDPOINT_URL}?path=create-job&method=POST&payload=${encodedPayload}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create job');
        return;
      }

      // Handle successful job creation (e.g., navigate to another page or show a success message)
        console.log('Job created successfully');
        navigate('/all-job-postings');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <Grid container justifyContent="center" sx={{ mt: 4 }}>
      <Grid item xs={12} sm={8} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              Create Job
            </Typography>
            {error && (
              <Typography variant="body2" color="error" gutterBottom>
                {error}
              </Typography>
            )}
            <form onSubmit={handleSubmit}>
              <TextField
                label="Job Title"
                fullWidth
                margin="normal"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
              />
              <TextField
                label="Salary Per Month"
                fullWidth
                margin="normal"
                type="number"
                value={salaryPerMonth}
                onChange={(e) => setSalaryPerMonth(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
                required
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Timing From"
                    fullWidth
                    margin="normal"
                    type="number"
                    value={timingFrom}
                    onChange={(e) => setTimingFrom(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    select
                    label="Period"
                    fullWidth
                    margin="normal"
                    value={timingFromPeriod}
                    onChange={(e) => setTimingFromPeriod(e.target.value)}
                    required
                  >
                    <MenuItem value="AM">AM</MenuItem>
                    <MenuItem value="PM">PM</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Timing To"
                    fullWidth
                    margin="normal"
                    type="number"
                    value={timingTo}
                    onChange={(e) => setTimingTo(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    select
                    label="Period"
                    fullWidth
                    margin="normal"
                    value={timingToPeriod}
                    onChange={(e) => setTimingToPeriod(e.target.value)}
                    required
                  >
                    <MenuItem value="AM">AM</MenuItem>
                    <MenuItem value="PM">PM</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Create Job
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CreateJob;
