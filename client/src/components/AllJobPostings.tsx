import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const AllJobPostings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [jobPostings, setJobPostings] = useState(location.state?.jobPostings || []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/shop-details', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch job postings');
          return;
        }

        const data = await response.json();
        setJobPostings(data.jobPostings);
      } catch (err) {
        setError('Something went wrong. Please try again.');
      }
    };

    fetchJobPostings();
  }, []);

  return (
    <Grid
      container
      spacing={3}
      sx={{ maxWidth: 800, margin: 'auto', mt: 4, p: 2 }}
    >
      <Grid item xs={12}>
        <Typography variant="h5" fontWeight={600} textAlign="center">
          All Job Postings
        </Typography>
      </Grid>

      {error && (
        <Grid item xs={12}>
          <Typography variant="body2" color="error" textAlign="center">
            {error}
          </Typography>
        </Grid>
      )}

      {jobPostings.length === 0 ? (
        <Grid item xs={12}>
          <Typography variant="body2" color="textSecondary" textAlign="center">
            You have not posted any jobs yet...
          </Typography>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate('/create-job')}
          >
            Post a New Job
          </Button>
        </Grid>
      ) : (
        jobPostings.map((job) => (
          <Grid item xs={12} key={job.id}>
            <Card
              sx={{ p: 2, cursor: 'pointer' }}
              onClick={() => navigate(`/job/${job.id}`)}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={600}>
                  {job.jobTitle}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ₹{job.salaryPerMonth} | {job.timingFrom} - {job.timingTo}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}

      {jobPostings.length > 0 && (
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate('/create-job')}
          >
            Post a New Job
          </Button>
        </Grid>
      )}
      <Grid item xs={12}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => navigate('/shop-dashboard')}
        >
          Back
        </Button>
      </Grid>
    </Grid>
  );
};

export default AllJobPostings;
