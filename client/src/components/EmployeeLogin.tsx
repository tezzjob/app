import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Container,
  Grid2,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import React, { useState } from 'react';
import { validateEmail, validateMobile } from '../util/helper';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINT_URL } from '../config';

const EmployeeLogin = () => {
  const [name, setName] = useState('');
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [displayMail, setDisplayMail] = useState('');
  const [mobile, setMobile] = useState('');
  const [locality, setLocality] = useState<string[]>([]);
  const [loading, setLoading] = useState(false); // To manage loading state
  const [error, setError] = useState<string | null>(null); // To manage errors
  const [isEmailSend, setEmailSent] = useState(false);
  const localityOptions = ['Pune', 'Hyderabad', 'Mumbai', 'Kolkata', 'Nagpur', 'Nashik', 'Thane']

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error state

    if (name.length === 0)
      setError('Name is required')
    if (!validateEmail(email))
      setError('Invalid Email')
    if (!validateMobile(mobile))
      setError('Invalid Mobile')
    if (locality.length === 0)
      setError('Select at least 1 locality')

    setDisplayMail(email);
    try {
      const response = await fetch(`${API_ENDPOINT_URL}/employee/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, mobile, email, locality, username }),
      });

      if (response.status >= 400 && response.status < 500) {
        console.log(response)
        const error = await response.json()
        setError(error.message)
      }
      else if (!response.ok) {
        throw new Error('Failed to register. Please try again.');
      }
      else {
        setEmailSent(true);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth={'xs'}>
      <Paper elevation={10} sx={{ marginTop: 8, padding: 2 }}>
        <>
          {!isEmailSend && (
            <Avatar
              sx={{
                mt: 4,
                mx: 'auto',
                bgcolor: 'primary.main',
                textAlign: 'center',
              }}
            >
              <HowToRegOutlinedIcon />
            </Avatar>
          )}

          <Typography
            component="h1"
            variant="h5"
            sx={{ textAlign: 'center', pt: 2 }}
          >
            {`${isEmailSend ? 'HOORRAY!' : 'SEARCH JOBS'}`}
          </Typography>

          {error && (
            <Typography color="error" sx={{ textAlign: 'center', mt: 2 }}>
              {error}
            </Typography>
          )}

          {isEmailSend ? (
            <Grid2 alignItems={'center'} justifyItems={'center'}>
              <Typography sx={{ textAlign: 'center', mt: 2 }}>
                A list of relevant shops is sent on
              </Typography>
              <Typography
                sx={{ mt: 1, cursor: 'pointer', marginLeft: 0.5 }}
                color="#3700CC"
                onClick={() => {}}
              >
                {displayMail}
              </Typography>
              <Typography
                sx={{ mt: 1, cursor: 'pointer', marginLeft: 0.5 }}
                color="#3700CC"
                onClick={() => setEmailSent(false)}
              >
                back
              </Typography>
            </Grid2>
          ) : (
            <Grid2 alignItems={'center'} justifyItems={'center'}>
              <Box
                component="form"
                onSubmit={(e) => handleSubmit(e)}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  placeholder="Enter Full Name"
                  value={name}
                  fullWidth
                  required
                  autoFocus
                  sx={{ my: 2 }}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <TextField
                  placeholder="Enter Email"
                  value={email}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  placeholder="Enter Mobile"
                  value={mobile}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                  onChange={(e) => setMobile(e.target.value)}
                />
                <Autocomplete
                  multiple
                  options={localityOptions}
                  value={locality}
                  onChange={(event, newValue) => {
                    if (newValue.length <= 3) setLocality(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select upto 3 Localities"
                      fullWidth
                      required
                    />
                  )}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2, mb: 2 }}
                  disabled={
                    loading ||
                    name.length === 0 ||
                    locality.length === 0 ||
                    !validateEmail(email) ||
                    !validateMobile(mobile)
                  } // Disable button while loading
                >
                  {loading
                    ? 'fetching shops near you...'
                    : 'Get relevant shops'}
                </Button>

                <Button
                  variant="contained"
                  fullWidth
                    sx={{ mt: 1, mb: 2 }}
                  onClick={()=> {navigate('/persona-selection')}}
                    
                >
                  Back
                </Button>
              </Box>
            </Grid2>
          )}
        </>
      </Paper>
    </Container>
  );
};

export default EmployeeLogin;
