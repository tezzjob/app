import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: `'Poppins', 'Roboto', 'Arial', sans-serif`,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: `'Poppins', Arial, sans-serif`, // Apply globally
        },
        a: {
          fontFamily: `'Poppins', Arial, sans-serif`, // Ensure links inherit font
        },
      },
    },
  },
  palette: {
    primary: {
      main: '#3700CC',
    },
    secondary: {
      main: '#2b2b2b',
    },
  },
});

export default theme;
