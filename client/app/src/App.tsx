import React from 'react';
import {Grid} from '@mui/material';
import MyProfile from './pages/MyProfile';

const username = 'marijakompar'
const fullname = 'Marija Kompar'
const followers = 10
const following = 10

function App() {
  return (
    <Grid container spacing = {0} direction = "column" alignItems = "center" justifyContent = "center">
        <Grid item width = "40%">
          <MyProfile username = {username} fullname = {fullname} followers = {followers} following = {following} />
        </Grid>
    </Grid>
  );
}

export default App;
