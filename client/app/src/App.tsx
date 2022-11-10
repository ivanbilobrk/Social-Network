import React from 'react';
import {Grid} from '@mui/material';
import MyProfile from './pages/MyProfile';

let info = 
  {
    username: 'ben10',
    fullname: 'Ben Ten',
    followers: 454,
    following: 343,
  }


function App() {
  return (
    <Grid container spacing = {0} direction = "column" alignItems = "center" justifyContent = "center">
        <Grid item width = "40%">
          <MyProfile info = {info} />
        </Grid>
    </Grid>
  );
}

export default App;
