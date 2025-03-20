import { Paper, Avatar, Typography, Grid2, Box, TextField, Button, Container, InputAdornment, IconButton, Autocomplete } from '@mui/material';
import React, { useState } from 'react'
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { validateEmail, validateMobile } from '../util/helper';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINT_URL } from '../config';

const ShopKeeperLogin = () => {
  const [email, setEmail] = useState('');
  const [displayMail, setDisplayMail] = useState('');
  const [mobile, setMobile] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [shopName, setShopName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isRegLoading, setRegLoading] = useState(false); // To manage loading state
  const [isLoginLoading, setLoginLoading] = useState(false); // To manage loading state
  const [isFPLoading, setIsFPLoading] = useState(false); // To manage loading state
  const [error, setError] = useState<string | null>(null); // To manage errors
  const [form, setForm] = useState<'Login' | 'Register' | 'ForgotPassword'>(
    'Login'
  );
  const [locality, setLocality] = useState<string[]>([]);
  const [isRegSuccess, setRegSuccess] = useState<boolean>(false);
  const localityOptions = [
    'Pune',
    'Hyderabad',
    'Mumbai',
    'Kolkata',
    'Nagpur',
    'Nashik',
    'Thane',
  ];

   const navigate = useNavigate();

  const isValidForm = () => {
    if (
      password.length === 0 ||
      password !== confirmPassword ||
      ownerName.length === 0 ||
      !validateEmail(email) ||
      !validateMobile(mobile) ||
      locality.length === 0
    )
      return false;
    return true;
  };
  const handleChangeForm = (
    formType: 'Login' | 'Register' | 'ForgotPassword'
  ) => {
    setOwnerName('');
    setEmail('');
    setMobile('');
    setPassword('');
    setLocality([]);
    setConfirmPassword('');
    setPasswordVisible(false);
    setShopName('');
    setError(null);
    setForm(formType);
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegLoading(true);
    setError(null); // Reset error state
    setDisplayMail(email);

    const payload = JSON.stringify({
      ownerName,
      ownerEmail: email,
      ownerMobile: mobile,
      shopLocation: locality[0],
      shopName,
      password,
      confirmPassword,
    });

    const encodedPayload = btoa(JSON.stringify(payload));
    try {
      const response = await fetch(
        `${API_ENDPOINT_URL}?path=shopkeeper/signup&method=POST&payload=${encodedPayload}`,
        {
          // method: "POST",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 422) {
        const error = await response.json();
        setError(error.message);
      } else if (!response.ok) {
        throw new Error('Failed to register. Please try again.');
      } else {
        handleChangeForm('Register');
        setRegSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong!');
    } finally {
      setRegLoading(false);
    }
  };

  const handleLoginSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoginLoading(true);
    setError(null); // Reset error state
    setDisplayMail(email);

    const encodedPayload = btoa(
      JSON.stringify({
        ownerEmail: email,
        password: password.trim(),
      })
    );
    try {
      const response = await fetch(
        `${API_ENDPOINT_URL}?path=shopkeeper/login&method=POST&payload=${encodedPayload}`,
        {
          method: 'GET',
          // method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 422) {
        const error = await response.json();
        setError(error.message);
      } else if (!response.ok) {
        throw new Error('Failed to login. Please try again.');
      } else {
        const data = await response.json();
        localStorage.setItem('jwtToken', data.token); // Store the token in localStorage
        handleChangeForm('Login');
        navigate('/shop-dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong!');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsFPLoading(true);
    setError(null); // Reset error state

    const encodedPayload = btoa(
      JSON.stringify({
        email: email,
      })
    );
    try {
      const response = await fetch(
        `${API_ENDPOINT_URL}?path=forgot-password&method=POST&payload=${encodedPayload}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 422) {
        const error = await response.json();
        setError(error.message);
      } else if (!response.ok) {
        throw new Error('Failed to send email. Please try again.');
      } else {
        handleChangeForm('Login');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong!');
    } finally {
      setIsFPLoading(false);
    }
  };

  return (
    <Container maxWidth={'xs'}>
      {form === 'Login' && (
        <Paper elevation={10} sx={{ marginTop: 8, padding: 2 }}>
          <>
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

            <Typography
              component="h1"
              variant="h5"
              sx={{ textAlign: 'center', pt: 2 }}
            >
              Login
            </Typography>

            {error && (
              <Typography color="error" sx={{ textAlign: 'center', mt: 2 }}>
                {error}
              </Typography>
            )}

            <Grid2 alignItems={'center'} justifyItems={'center'}>
              <Box
                component="form"
                onSubmit={(e) => {
                  handleLoginSubmit(e);
                }}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  placeholder="Enter Email"
                  value={email}
                  fullWidth
                  required
                  autoFocus
                  sx={{ my: 2 }}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  placeholder="Enter Password"
                  value={password}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                  type={passwordVisible ? 'text' : 'password'} // Toggle between text and password
                  onChange={(e) => setPassword(e.target.value)}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setPasswordVisible((prev) => !prev)}
                          >
                            {passwordVisible ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2, mb: 2 }}
                  disabled={
                    isLoginLoading ||
                    !validateEmail(email) ||
                    password.length === 0
                  } // Disable button while loading
                >
                  {isLoginLoading ? 'Logging in...' : 'Login'}
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 1, mb: 2 }}
                  onClick={() => navigate('/persona-selection')}
                >
                  Back
                </Button>
              </Box>
              <Grid2 display={'flex'}>
                <Typography>Don't have an account?</Typography>
                <Typography
                  sx={{ cursor: 'pointer', marginLeft: 0.5 }}
                  color="#3700CC"
                  onClick={() => handleChangeForm('Register')}
                >
                  Register
                </Typography>
              </Grid2>
              <Grid2 display={'flex'}>
                <Typography
                  sx={{ mt: 1, cursor: 'pointer', marginLeft: 0.5 }}
                  color="#3700CC"
                  onClick={() => handleChangeForm('ForgotPassword')}
                >
                  Forgot Password
                </Typography>
              </Grid2>
            </Grid2>
          </>
        </Paper>
      )}
      {form === 'Register' && (
        <Paper elevation={10} sx={{ marginTop: 8, padding: 2 }}>
          <>
            {!isRegSuccess && (
              <Avatar
                sx={{
                  mt: 2,
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
              {isRegSuccess ? 'Registration Successful!' : 'Register'}
            </Typography>

            {error && (
              <Typography color="error" sx={{ textAlign: 'center', mt: 2 }}>
                {error}
              </Typography>
            )}

            {isRegSuccess ? (
              <Grid2 alignItems={'center'} justifyItems={'center'}>
                <Typography sx={{ textAlign: 'center', mt: 2 }}>
                  Please validate your email by clicking link sent on
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
                  onClick={() => handleChangeForm('Login')}
                >
                  back
                </Typography>
              </Grid2>
            ) : (
              <Grid2 alignItems={'center'} justifyItems={'center'}>
                <Box
                  component="form"
                  onSubmit={(e) => handleRegisterSubmit(e)}
                  noValidate
                >
                  <TextField
                    placeholder="Enter Shop Name"
                    value={shopName}
                    fullWidth
                    required
                    autoFocus
                    sx={{ mt: 2 }}
                    onChange={(e) => setShopName(e.target.value)}
                  />
                  <TextField
                    placeholder="Enter Owner's Full Name"
                    value={ownerName}
                    fullWidth
                    required
                    autoFocus
                    sx={{ mt: 2 }}
                    onChange={(e) => setOwnerName(e.target.value)}
                  />
                  <TextField
                    placeholder="Enter Email"
                    value={email}
                    fullWidth
                    required
                    autoFocus
                    sx={{ my: 2 }}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                    placeholder="Enter Mobile"
                    value={mobile}
                    fullWidth
                    required
                    autoFocus
                    sx={{ mb: 2 }}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                  <Autocomplete
                    multiple
                    options={localityOptions}
                    value={locality}
                    onChange={(event, newValue) => {
                      if (newValue.length <= 1) setLocality(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select shop area"
                        fullWidth
                        required
                      />
                    )}
                  />
                  <TextField
                    placeholder="Enter Password"
                    value={password}
                    fullWidth
                    required
                    sx={{ my: 2 }}
                    type={passwordVisible ? 'text' : 'password'} // Toggle between text and password
                    onChange={(e) => setPassword(e.target.value)}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setPasswordVisible((prev) => !prev)
                              }
                            >
                              {passwordVisible ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <TextField
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                    type={passwordVisible ? 'text' : 'password'} // Toggle between text and password
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setPasswordVisible((prev) => !prev)
                              }
                            >
                              {passwordVisible ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2, mb: 2 }}
                    disabled={isRegLoading || !isValidForm()} // Disable button while loading
                  >
                    {isRegLoading ? 'Registering...' : 'Register'}
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 1, mb: 2 }}
                    onClick={() => navigate('/persona-selection')}
                  >
                    Back
                  </Button>
                </Box>
                <Grid2 display={'flex'}>
                  <Typography>Already Registered?</Typography>
                  <Typography
                    sx={{ cursor: 'pointer', marginLeft: 0.5 }}
                    color="#3700CC"
                    onClick={() => handleChangeForm('Login')}
                  >
                    Login
                  </Typography>
                </Grid2>
                <Grid2 display={'flex'}>
                  <Typography
                    sx={{ mt: 1, cursor: 'pointer', marginLeft: 0.5 }}
                    color="#3700CC"
                    onClick={() => setForm('ForgotPassword')}
                  >
                    Forgot Password
                  </Typography>
                </Grid2>
              </Grid2>
            )}
          </>
        </Paper>
      )}
      {form === 'ForgotPassword' && (
        <Paper elevation={10} sx={{ marginTop: 8, padding: 2 }}>
          <>
            <Avatar
              sx={{
                mt: 4,
                mx: 'auto',
                bgcolor: 'primary.main',
                textAlign: 'center',
              }}
            >
              <ErrorOutline />
            </Avatar>

            <Typography
              component="h1"
              variant="h5"
              sx={{ textAlign: 'center', pt: 2 }}
            >
              Forgot Password
            </Typography>

            {error && (
              <Typography color="error" sx={{ textAlign: 'center', mt: 2 }}>
                {error}
              </Typography>
            )}

            <Grid2 alignItems={'center'} justifyItems={'center'}>
              <Box
                component="form"
                onSubmit={(e) => {handleForgotPassword(e)}}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  placeholder="Enter Email"
                  value={email}
                  fullWidth
                  required
                  autoFocus
                  sx={{ my: 2 }}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2, mb: 2 }}
                  disabled={isFPLoading || !validateEmail(email)} // Disable button while loading
                >
                  {'Submit'}
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 1, mb: 2 }}
                  onClick={() => navigate('/persona-selection')}
                >
                  Back
                </Button>
              </Box>
              <Grid2 display={'flex'}>
                <Typography
                  sx={{ mt: 1, cursor: 'pointer', marginLeft: 0.5 }}
                  color="#3700CC"
                  onClick={() => handleChangeForm('Login')}
                >
                  Login
                </Typography>
              </Grid2>
            </Grid2>
          </>
        </Paper>
      )}
    </Container>
  );
}

export default ShopKeeperLogin