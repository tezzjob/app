import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Avatar,
  Button,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINT_URL } from '../config';

interface ShopDetails {
  shop: {
    shopName: string;
    ownerEmail: string;
    ownerMobile: string;
    shopLocation: string;
    businessCategory: string;
  };
  jobPostings: {
    jobTitle: string;
    salaryPerMonth: string;
    isActive: boolean;
    id: number;
    timingFrom: string;
    timingTo: string;
  }[];
}

const ShopkeeperDashboard = () => {
  const navigate = useNavigate();

  const [shopDetails, setShopDetails] = useState<ShopDetails>();
  const [error, setError] = useState<string>(''); 

  useEffect(() => {
    const fetchShopDetails = async () => {
      const token = localStorage.getItem('jwtToken'); // Retrieve the JWT token

      // Add JWT token to headers
      const response = await fetch(`${API_ENDPOINT_URL}/shop-details`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('invoked');
      if(!response.ok) {
        console.error('Failed to fetch shop details');
        setError('Failed to fetch shop details');
        return;
      }
      const data = await response.json();
      setShopDetails(data);
    };
    fetchShopDetails();
  }, [])

  const getInitials = (name: string) => {
    const words = name.split(' ');
    const initials = words.map(word => word[0]).join('');
    return initials.toUpperCase();
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT_URL}?path=logout&method=POST`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to logout');
        return;
      }

      // Clear the JWT token from localStorage
      localStorage.removeItem('jwtToken');
      // Redirect to login page
      navigate('/');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return shopDetails ? (
    <Grid
      container
      spacing={3}
      sx={{ maxWidth: 800, margin: 'auto', mt: 4, p: 2 }}
    >
      {/* Shop Profile Card */}
      <Grid item xs={12}>
        <Card sx={{ p: 2, position: 'relative' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar
                sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}
              >
                {getInitials(shopDetails.shop.shopName)}
              </Avatar>
            </Grid>
            <Grid item xs>
              <CardContent>
                <Typography variant="h6" fontWeight={600}>
                  {shopDetails.shop.shopName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Location: {shopDetails.shop.shopLocation}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Contact: {shopDetails.shop.ownerMobile}
                </Typography>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* Job Postings Card */}
      <Grid item xs={12}>
        <Card sx={{ p: 2, position: 'relative' }}>
          <IconButton
            sx={{ position: 'absolute', top: 10, right: 10 }}
            onClick={() => navigate('/all-job-postings', {state: {jobPostings: shopDetails.jobPostings}})}
          >
            <MoreVertIcon />
          </IconButton>
          <CardContent>
            <Typography variant="h6" fontWeight={600}>
              Job Postings
            </Typography>
            {shopDetails.jobPostings.length === 0 ? (
              <div>
                <Typography variant="body2" color="textSecondary">
                  You have not posted any jobs yet...
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/create-job', { state: { jobPostings: shopDetails.jobPostings } })}
                >
                  Post a Job
                </Button>
              </div>
            ) : (
              shopDetails.jobPostings.map((job) => (
                <Card
                  key={job.id}
                  sx={{ mt: 2, p: 1, cursor: 'pointer' }}
                  onClick={() => navigate(`/job/${job.id}`)}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    {job.jobTitle}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {job.salaryPerMonth} | {job.timingFrom} - {job.timingTo}
                  </Typography>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Logout Button */}
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Grid>
    </Grid>
  ) : (<></>)
};

export default ShopkeeperDashboard;
