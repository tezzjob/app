import { Button, Grid2, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const VerifyShop = () => {
  const [status, setStatus] = useState('Verifying...');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const uuid = searchParams.get('uuid');

    if (!uuid) {
      setStatus('Invalid verification link.');
      return;
    }

      fetch(`http://localhost:8080/api/verify?uuid=${uuid}`, {
          method: 'GET'})
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setStatus('Your account has been verified successfully!');
        } else {
          setStatus(data.message);
        }
      })
      .catch(() =>
        setStatus('An error occurred while verifying your account.')
      );
  }, []);

    return (
        <Grid2 justifyContent={'center'} justifyItems={'center'}>
            <Typography variant={'h3'} sx={{ my: 4 }}>{status}</Typography>
            <Button variant='contained' component={Link} to='/shopkeeper-login'>Login</Button>
      </Grid2>
    );
};

export default VerifyShop;
