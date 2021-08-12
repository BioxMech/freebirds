import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

function Loading_screen({ content, boxHeight }) {

  const theme = createTheme();

  theme.typography.h3 = {
    fontSize: '2rem', // mobile
    '@media (min-width:600px)': {
      fontSize: '2.5rem', // laptop
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '3rem', // monitor
    },
  };

  let heightOfBox;

  if (!boxHeight) {
    heightOfBox = "80vh";
  } else {
    heightOfBox = boxHeight;
  }
  
  return (
    <Box mx={"auto"}  display="flex" alignItems="center" justifyContent="center" style={{ height: heightOfBox }}>
      <Box style={{ textAlign: "center" }} my={"auto"}> 
        <img src="https://www.animatedimages.org/data/media/230/animated-bird-image-0250.gif" style={{ width: "200px"}} alt="..." />
        <ThemeProvider theme={theme}>
          <Typography variant="h3">
            { content }
          </Typography>
        </ThemeProvider>
      </Box>
    </Box>
  )
} 

export default Loading_screen;
