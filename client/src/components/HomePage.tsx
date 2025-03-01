import React from 'react'
import NavBar from './NavBar';
import { Box, Grid, Grid2, Link, Typography } from '@mui/material';
import Carousel from 'react-material-ui-carousel';


const HomePage = () => {
  const images = [
    {
      src: 'images/homepage-image1.jpg',
      alt: 'Image 1',
    },
    {
      src: 'images/homepage-image2.jpg',
      alt: 'Image 2',
    },
    {
      src: 'images/homepage-image3.jpg',
      alt: 'Image 3',
    },
  ];
  return (
    <>
      <Grid2 sx={{ display: 'flex', mt: '50px', justifyContent: 'center' }}>
        <Grid2>
          <Typography
            variant="h2"
            fontWeight={'bold'}
            color="#2b2b2b"
            align="center"
          >
            TezzJob
          </Typography>
          <Typography
            variant="h2"
            align="center"
            color="#bebebe"
            fontWeight="lighter"
            fontSize={'48px'}
            marginTop={'20px'}
          >
            Jobs for Every Hand, Help for Every Shop!
          </Typography>
          <Typography
            marginTop={'20px'}
            fontSize={'24px'}
            color="#2b2b2b"
            align="center"
            fontWeight={'lighter'}
          >
            Find Jobs. Build Teams. Simplified.
          </Typography>
        </Grid2>
      </Grid2>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '500px',
          margin: 'auto',
          marginTop: '30px',
          overflow: 'hidden',
        }}
      >
        {/* Background overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(55, 0, 204, 0.1)', // Adjust opacity and color
            zIndex: 1,
          }}
        ></Box>

        {/* Carousel */}
        <Carousel
          sx={{
            position: 'relative',
            zIndex: 2, // Ensure it's above the background overlay
            margin: 'auto',
            width: '100%',
            height: '500px',
          }}
          animation="fade"
          autoPlay={true}
          interval={3000}
          indicators={false}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={image.alt}
              style={{
                width: '100%',
                height: '600px',
                objectFit: 'contain',
                opacity: 0.8,
              }}
            />
          ))}
        </Carousel>
      </Box>

      {/**Footer */}
      <Box
        sx={{
          backgroundColor: '#fff',
          color: '#2b2b2b',
          padding: '15px',
        }}
      >
        {/* Footer Bottom */}
        <Box
          sx={{
            textAlign: 'center',
            borderTop: '1px solid #fff',
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} TezzJob. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export default HomePage