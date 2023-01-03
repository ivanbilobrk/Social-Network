import { Grid } from '@mui/material';
import React from 'react';
import Home from './Home';
import NavBar from '../components/NavBar';

const HomePage = () => {
  return (
    <>
      <NavBar />
      <Grid container direction="column" alignItems="center" justifyContent="center">
        <Grid item width="40%">
          <Home />
        </Grid>
      </Grid>
    </>
  );
};

export default HomePage;
