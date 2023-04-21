import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

//Theme for Navbar
const theme = createTheme({
  palette: {
    primary: {
      main: '#fff',
      darker: '#053e85',
    }
  },
});

function Navbar() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{flexGrow: 1}}>
        <AppBar>
          <Toolbar sx={{ gap: 2}}>
            <Box 
              component="img"
              sx={{width: 80, height: 80}}
              src='/cmu-18745-demo/f1tenth-logo.png'
              alt="logo of F1 Tenth"
            />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Diagnostic Dashboard
            </Typography>
            <Button color="inherit">Menu</Button>
            <Button color="inherit">User</Button>
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>

  );
}

export default Navbar;